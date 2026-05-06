const User = require('./User');
const Class = require('./Class');
const Enrollment = require('./Enrollment');
const AttendanceSession = require('./AttendanceSession');
const AttendanceRecord = require('./AttendanceRecord');

// User <-> Class (Lecturer)
User.hasMany(Class, { foreignKey: 'lecturerId', as: 'lecturerClasses' });
Class.belongsTo(User, { foreignKey: 'lecturerId', as: 'lecturer' });

// User <-> Enrollment (Student)
User.hasMany(Enrollment, { foreignKey: 'studentId' });
Enrollment.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Class <-> Enrollment
Class.hasMany(Enrollment, { foreignKey: 'classId' });
Enrollment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

// Class <-> AttendanceSession
Class.hasMany(AttendanceSession, { foreignKey: 'classId' });
AttendanceSession.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

// User <-> AttendanceRecord (Student)
User.hasMany(AttendanceRecord, { foreignKey: 'studentId' });
AttendanceRecord.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Class <-> AttendanceRecord
Class.hasMany(AttendanceRecord, { foreignKey: 'classId' });
AttendanceRecord.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

// Session <-> AttendanceRecord
AttendanceSession.hasMany(AttendanceRecord, { foreignKey: 'sessionId' });
AttendanceRecord.belongsTo(AttendanceSession, { foreignKey: 'sessionId', as: 'session' });

module.exports = {
  User,
  Class,
  Enrollment,
  AttendanceSession,
  AttendanceRecord
};
