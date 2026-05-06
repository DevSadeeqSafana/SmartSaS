const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
  },
  deviceId: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'attendance_records',
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'sessionId']
    },
    {
      unique: true,
      fields: ['deviceId', 'sessionId']
    }
  ]
});

module.exports = AttendanceRecord;
