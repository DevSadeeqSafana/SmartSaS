const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AttendanceSession = sequelize.define('AttendanceSession', {
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  qrToken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'attendance_sessions'
});

module.exports = AttendanceSession;
