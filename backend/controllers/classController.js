const { Class, Enrollment, User } = require('../models');
const crypto = require('crypto');

// Helper to generate unique class code
const generateClassCode = () => {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 character hex code
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Lecturer only)
exports.createClass = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    let classCode = generateClassCode();
    
    // Ensure code is unique
    let codeExists = await Class.findOne({ where: { classCode } });
    while (codeExists) {
      classCode = generateClassCode();
      codeExists = await Class.findOne({ where: { classCode } });
    }

    const newClass = await Class.create({
      name,
      description,
      lecturerId: req.user.id,
      classCode,
    });

    res.status(201).json({
      ...newClass.toJSON(),
      _id: newClass.id // Backward compatibility
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all classes for a lecturer
// @route   GET /api/classes/lecturer
// @access  Private (Lecturer only)
exports.getLecturerClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({ where: { lecturerId: req.user.id } });
    // Map to include _id for frontend compatibility
    const formattedClasses = classes.map(c => ({
      ...c.toJSON(),
      _id: c.id
    }));
    res.json(formattedClasses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a class using class code
// @route   POST /api/classes/join
// @access  Private (Student only)
exports.joinClass = async (req, res) => {
  try {
    const { classCode } = req.body;

    const targetClass = await Class.findOne({ where: { classCode } });
    if (!targetClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        studentId: req.user.id,
        classId: targetClass.id,
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    await Enrollment.create({
      studentId: req.user.id,
      classId: targetClass.id,
    });

    res.status(201).json({
      message: 'Successfully joined class',
      class: {
        ...targetClass.toJSON(),
        _id: targetClass.id
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all enrolled classes for a student
// @route   GET /api/classes/enrolled
// @access  Private (Student only)
exports.getEnrolledClasses = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({ 
      where: { studentId: req.user.id },
      include: [{ model: Class, as: 'class' }]
    });
    const classes = enrollments.map(enrollment => ({
      ...enrollment.class.toJSON(),
      _id: enrollment.class.id
    }));
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific class details (for lecturer to see students)
// @route   GET /api/classes/:id
// @access  Private
exports.getClassDetails = async (req, res) => {
  try {
    const classId = req.params.id;
    const targetClass = await Class.findByPk(classId, {
      include: [{ model: User, as: 'lecturer', attributes: ['name', 'email'] }]
    });
    
    if (!targetClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // If lecturer, also get students
    let students = [];
    if (req.user.role === 'lecturer' && targetClass.lecturerId === req.user.id) {
      const enrollments = await Enrollment.findAll({ 
        where: { classId: classId },
        include: [{ model: User, as: 'student', attributes: ['name', 'email'] }]
      });
      students = enrollments.map(e => ({
        ...e.student.toJSON(),
        _id: e.student.id
      }));
    }

    res.json({
      ...targetClass.toJSON(),
      _id: targetClass.id,
      students
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
