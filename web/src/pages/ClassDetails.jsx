import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { 
  Users, 
  ChevronLeft, 
  QrCode, 
  History, 
  Download,
  Loader2,
  CheckCircle2,
  User as UserIcon,
  RefreshCw,
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import QRCode from 'react-qr-code';
const QRCodeComponent = QRCode.default || QRCode;
import { jsonToCSV, downloadFile } from '../utils/exportUtils';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrSession, setQrSession] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [activeTab, setActiveTab] = useState('students');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchClassData();
    fetchAttendance();
  }, [id]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && qrSession) {
      // Auto-refresh QR code when it expires
      startAttendanceSession();
    }
    return () => clearInterval(timer);
  }, [countdown, qrSession]);

  const fetchClassData = async () => {
    try {
      const response = await api.get(`/classes/${id}`);
      setClassData(response.data);
      setStudents(response.data.students || []);
    } catch (err) {
      console.error('Failed to fetch class data', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get(`/attendance/${id}`);
      setAttendanceRecords(response.data);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    }
  };

  const startAttendanceSession = async () => {
    try {
      const response = await api.post('/attendance/generate', { classId: id });
      if (response.data && response.data.qrToken) {
        setQrSession(response.data);
        setCountdown(60); // 1 minute
        // Refresh attendance records every few seconds during active session
        const interval = setInterval(fetchAttendance, 3000);
        setTimeout(() => clearInterval(interval), 65000);
      } else {
        console.error('Invalid response from server - qrToken missing:', response.data);
      }
    } catch (err) {
      console.error('Failed to start session:', err.response?.data || err.message);
    }
  };

  const handleExport = () => {
    if (!classData) return;
    const dataToExport = attendanceRecords.map(rec => ({
      Student_Name: rec.student?.name || 'Unknown',
      Email: rec.student?.email || 'N/A',
      Date: new Date(rec.timestamp).toLocaleDateString(),
      Time: new Date(rec.timestamp).toLocaleTimeString(),
    }));
    
    const csv = jsonToCSV(dataToExport, ['Student_Name', 'Email', 'Date', 'Time']);
    downloadFile(csv, `${classData.name}_attendance.csv`, 'text/csv');
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-white border border-gray-100 rounded-xl text-gray-600 font-medium hover:bg-gray-50 shadow-sm transition-all"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
          {!qrSession && user?.role === 'lecturer' && (
            <button 
              onClick={startAttendanceSession}
              className="flex items-center px-6 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Start Attendance
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Students */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{classData?.name}</h1>
                <p className="text-gray-500 text-lg mt-1">{classData?.description}</p>
              </div>
              <span className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold tracking-widest border border-primary-100">
                {classData?.classCode}
              </span>
            </div>
            
            <div className="flex gap-8 border-t border-gray-50 pt-8">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 font-medium">{students.length} Enrolled Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600 font-medium">{attendanceRecords.length} Total Check-ins</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-6 py-3 border-b border-gray-50 flex space-x-2 bg-gray-50/30">
                <button 
                  onClick={() => setActiveTab('students')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'students' 
                      ? 'bg-primary-50 text-primary-600 shadow-sm' 
                      : 'text-gray-500 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  Registered Students
                </button>
                <button 
                  onClick={() => setActiveTab('attendance')}
                  className={`px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'attendance' 
                      ? 'bg-primary-50 text-primary-600 shadow-sm' 
                      : 'text-gray-500 hover:bg-white hover:text-gray-900'
                  }`}
                >
                  Attendance History
                </button>
             </div>

             <div className="overflow-x-auto">
                {activeTab === 'students' ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <th className="px-8 py-4">Name</th>
                        <th className="px-8 py-4">Email</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students.map((student, index) => (
                        <tr key={student.id || student._id || `student-${index}`} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-8 py-4">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center font-bold mr-3 group-hover:scale-110 transition-transform">
                                {student.name?.charAt(0) || '?'}
                              </div>
                              <span className="font-semibold text-gray-900">{student.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-4 text-gray-600">{student.email}</td>
                          <td className="px-8 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <button className="text-primary-600 font-semibold hover:underline text-sm">Report</button>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-8 py-12 text-center text-gray-500 italic">No students have joined this class yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <th className="px-8 py-4">Student</th>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Time</th>
                        <th className="px-8 py-4 text-right">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {attendanceRecords.map((record, index) => (
                        <tr key={record.id || record._id || `record-${index}`} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-4 font-semibold text-gray-900">{record.student?.name}</td>
                          <td className="px-8 py-4 text-gray-600">{new Date(record.timestamp).toLocaleDateString()}</td>
                          <td className="px-8 py-4 text-gray-600">{new Date(record.timestamp).toLocaleTimeString()}</td>
                          <td className="px-8 py-4 text-right text-gray-400 text-xs">
                             {record.latitude ? `${parseFloat(record.latitude).toFixed(4)}, ${parseFloat(record.longitude).toFixed(4)}` : 'No GPS data'}
                          </td>
                        </tr>
                      ))}
                      {attendanceRecords.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-8 py-12 text-center text-gray-500 italic">No attendance records yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: QR Generator */}
        <div className="space-y-8">
          {qrSession && qrSession.qrToken ? (
            <div className="bg-white p-8 rounded-3xl border-2 border-primary-500 shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Active QR Code</h3>
                <div className="flex items-center bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                   <Clock className="h-3 w-3 mr-1" />
                   {countdown}s
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-2xl flex justify-center mb-6 border border-gray-200">
                <QRCodeComponent 
                  value={qrSession.qrToken} 
                  size={200}
                  fgColor="#0c4a6e"
                  level="H"
                />
              </div>

              <p className="text-center text-gray-500 text-sm mb-6 px-4">
                Students should scan this code using the <span className="font-bold text-gray-900">SAS Mobile App</span>.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={startAttendanceSession}
                  className="w-full flex items-center justify-center py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Manually
                </button>
                <button 
                  onClick={() => { setQrSession(null); setCountdown(0); }}
                  className="w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
                >
                  Stop Session
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-primary-600 to-blue-700 p-8 rounded-3xl shadow-xl text-white">
              <QrCode className="h-12 w-12 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-4 italic">Ready to take attendance?</h3>
              <p className="text-primary-100 mb-8 leading-relaxed">
                Start a secure session to generate a dynamic code that your students can scan. Codes expire every minute to prevent sharing.
              </p>
              <button 
                onClick={startAttendanceSession}
                className="w-full py-4 bg-white text-primary-700 font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Launch QR Session
              </button>
            </div>
          )}

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
             <h4 className="font-bold text-gray-900 mb-4 flex items-center">
               <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
               Live Update
             </h4>
             <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="h-10 w-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Waiting for scans...</p>
                    <p className="text-xs text-gray-400">Real-time stats will appear here.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;
