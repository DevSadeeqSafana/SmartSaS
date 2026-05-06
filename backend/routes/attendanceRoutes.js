const express = require('express');
const router = express.Router();
const { 
  generateSession, 
  markAttendance, 
  getAttendanceByClass,
  getStudentAttendance
} = require('../controllers/attendanceController');
const { protect, lecturerOnly, studentOnly } = require('../middleware/authMiddleware');

router.post('/generate', protect, lecturerOnly, generateSession);
router.post('/mark', protect, studentOnly, markAttendance);
router.get('/student', protect, studentOnly, getStudentAttendance);
router.get('/:classId', protect, getAttendanceByClass);

module.exports = router;
