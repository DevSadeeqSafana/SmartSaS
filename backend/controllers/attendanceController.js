const { AttendanceSession, AttendanceRecord, Enrollment, User, Class } = require('../models');
const crypto = require('crypto');
const { Op } = require('sequelize');

// @desc    Generate a new dynamic QR token/session
// @route   POST /api/attendance/generate
// @access  Private (Lecturer)
exports.generateSession = async (req, res) => {
  try {
    const { classId } = req.body;
    console.log('Generating session - Request body:', req.body);
    console.log('Generating session for classId:', classId);

    // Invalidate previous active sessions for this class
    const updateResult = await AttendanceSession.update(
      { isActive: false },
      { where: { classId, isActive: true } }
    );
    console.log('Previous sessions invalidated:', updateResult);

    // Generate new token
    const qrToken = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds from now

    const session = await AttendanceSession.create({
      classId,
      qrToken,
      expiresAt,
    });
    console.log('New session created:', session.id);

    res.status(201).json({
      ...session.toJSON(),
      _id: session.id // Backward compatibility
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance (Scan QR)
// @route   POST /api/attendance/mark
// @access  Private (Student)
exports.markAttendance = async (req, res) => {
  try {
    const { qrToken, location, deviceId } = req.body;

    // 1. Find the active session for this token
    const session = await AttendanceSession.findOne({ 
      where: {
        qrToken, 
        isActive: true,
        expiresAt: { [Op.gt]: new Date() } 
      }
    });

    if (!session) {
      return res.status(400).json({ message: 'QR Code has expired or is invalid' });
    }

    // 2. Verify student is enrolled in this class
    const isEnrolled = await Enrollment.findOne({
      where: {
        studentId: req.user.id,
        classId: session.classId
      }
    });

    if (!isEnrolled) {
      return res.status(403).json({ message: 'You are not enrolled in this class' });
    }

    // 3. Prevent duplicate attendance for this session (Student + Session)
    const alreadyMarked = await AttendanceRecord.findOne({
      where: {
        studentId: req.user.id,
        sessionId: session.id
      }
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: 'Attendance already recorded for this session' });
    }

    // 4. Security Check: Prevent one device marking for multiple students
    if (deviceId) {
      const deviceAlreadyUsed = await AttendanceRecord.findOne({
        where: {
          deviceId,
          sessionId: session.id
        }
      });

      if (deviceAlreadyUsed) {
        return res.status(400).json({ message: 'This device has already been used to mark attendance for another student in this session.' });
      }
    }

    // 5. Record attendance
    const record = await AttendanceRecord.create({
      studentId: req.user.id,
      classId: session.classId,
      sessionId: session.id,
      latitude: location?.latitude,
      longitude: location?.longitude,
      deviceId
    });

    res.status(201).json({
      message: 'Attendance marked successfully',
      record: {
        ...record.toJSON(),
        _id: record.id
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records for a class
// @route   GET /api/attendance/:classId
// @access  Private
exports.getAttendanceByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    
    const records = await AttendanceRecord.findAll({ 
      where: { classId: classId },
      include: [
        { model: User, as: 'student', attributes: ['name', 'email'] },
        { model: AttendanceSession, as: 'session', attributes: ['createdAt'] }
      ]
    });

    const formattedRecords = records.map(r => ({
      ...r.toJSON(),
      _id: r.id
    }));

    res.json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records for the logged in student
// @route   GET /api/attendance/student
// @access  Private (Student)
exports.getStudentAttendance = async (req, res) => {
  try {
    const records = await AttendanceRecord.findAll({ 
      where: { studentId: req.user.id },
      include: [{ model: Class, as: 'class', attributes: ['name', 'classCode'] }],
      order: [['timestamp', 'DESC']]
    });

    const formattedRecords = records.map(r => ({
      ...r.toJSON(),
      _id: r.id
    }));

    res.json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
