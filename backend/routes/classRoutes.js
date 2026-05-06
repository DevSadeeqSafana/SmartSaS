const express = require('express');
const router = express.Router();
const { 
  createClass, 
  getLecturerClasses, 
  joinClass, 
  getEnrolledClasses,
  getClassDetails
} = require('../controllers/classController');
const { protect, lecturerOnly, studentOnly } = require('../middleware/authMiddleware');

router.post('/', protect, lecturerOnly, createClass);
router.get('/lecturer', protect, lecturerOnly, getLecturerClasses);
router.post('/join', protect, studentOnly, joinClass);
router.get('/enrolled', protect, studentOnly, getEnrolledClasses);
router.get('/:id', protect, getClassDetails);

module.exports = router;
