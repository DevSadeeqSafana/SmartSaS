import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StatusBar
} from 'react-native';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const { user, logout } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchEnrolledClasses(), fetchAttendance()]);
    setLoading(false);
    setRefreshing(false);
  };

  const fetchEnrolledClasses = async () => {
    try {
      const response = await api.get('/classes/enrolled');
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes', err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance/student');
      setAttendance(response.data);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleJoinClass = async () => {
    if (!classCode) return;
    setJoining(true);
    setJoinError('');
    try {
      await api.post('/classes/join', { classCode });
      setClassCode('');
      setShowJoinModal(false);
      fetchEnrolledClasses();
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Failed to join class');
    } finally {
      setJoining(false);
    }
  };

  const renderClassItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.classCard}
      onPress={() => navigation.navigate('ClassDetail', { classId: item._id, className: item.name })}
    >
      <View style={styles.cardIndicator} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.className}>{item.name}</Text>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{item.classCode}</Text>
          </View>
        </View>
        <Text style={styles.lecturerName}>Lecturer: {item.lecturer?.name || 'Assigned'}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.attendancePreview}>
            <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
            <Text style={styles.attendanceText}>Attendance: 85%</Text>
          </View>
          <Text style={styles.viewDetails}>View Details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dashboard}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{classes.length}</Text>
          <Text style={styles.statLabel}>Classes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{attendance.length}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>100%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Enrolled Classes</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't joined any classes yet.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowJoinModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showJoinModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join a New Class</Text>
            <Text style={styles.modalSubtitle}>Enter the 6-character code provided by your lecturer.</Text>
            
            {joinError ? <Text style={styles.modalError}>{joinError}</Text> : null}

            <TextInput
              style={styles.modalInput}
              placeholder="e.g. A1B2C3"
              value={classCode}
              onChangeText={(val) => setClassCode(val.toUpperCase())}
              autoCapitalize="characters"
              maxLength={6}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => {
                  setShowJoinModal(false);
                  setJoinError('');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.joinBtn} 
                onPress={handleJoinClass}
                disabled={joining}
              >
                {joining ? <ActivityIndicator color="#fff" /> : <Text style={styles.joinText}>Join Class</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  logoutBtn: {
    padding: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  dashboard: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: '#fff',
    width: '30%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  cardIndicator: {
    width: 6,
    backgroundColor: '#0ea5e9',
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  codeBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  lecturerName: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendancePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  attendanceText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  viewDetails: {
    fontSize: 12,
    color: '#0ea5e9',
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 64,
    height: 64,
    backgroundColor: '#0ea5e9',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalError: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 13,
  },
  modalInput: {
    width: '100%',
    height: 64,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  joinBtn: {
    flex: 2,
    height: 56,
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default HomeScreen;
