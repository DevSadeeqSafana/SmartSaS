import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Plus, 
  Users, 
  ArrowRight, 
  Clock, 
  BookOpen,
  Loader2,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDescription, setNewClassDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes/lecturer');
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await api.post('/classes', { 
        name: newClassName, 
        description: newClassDescription 
      });
      setNewClassName('');
      setNewClassDescription('');
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      console.error('Failed to create class', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Manage your active academic courses and sessions.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center shadow-lg shadow-primary-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Class
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><BookOpen className="h-6 w-6" /></div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Classes</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{classes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-50 p-2 rounded-lg text-green-600"><Users className="h-6 w-6" /></div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Avg. Attendance</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">84%</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-hover hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-2 rounded-lg text-amber-600"><Clock className="h-6 w-6" /></div>
          </div>
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Upcoming Session</p>
          <p className="text-xl font-bold text-gray-900 mt-1 line-clamp-1">Data Structures @ 2:00 PM</p>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Active Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="p-1 h-2 bg-gradient-to-r from-primary-400 to-blue-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{cls.name}</h3>
                   <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">{cls.classCode}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10 italic">
                  {cls.description || 'No description provided for this course.'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Created Apr 23</span>
                  </div>
                  <Link 
                    to={`/classes/${cls._id}`} 
                    className="text-primary-600 text-sm font-semibold flex items-center group-hover:translate-x-1 transition-transform"
                  >
                    Manage 
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {classes.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium text-lg">No classes found</p>
              <button 
                onClick={() => setShowModal(true)}
                className="mt-4 text-primary-600 font-semibold hover:underline"
              >
                Create your first class
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Setup New Class</h2>
            <form onSubmit={handleCreateClass} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Course Name</label>
                <input
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                  placeholder="e.g. Introduction to Programming"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Short Description</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all h-32 resize-none"
                  placeholder="Covering the basics of Python and algorithms..."
                  value={newClassDescription}
                  onChange={(e) => setNewClassDescription(e.target.value)}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
