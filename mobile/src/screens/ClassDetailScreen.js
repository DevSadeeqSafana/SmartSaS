import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Device from 'expo-device';
import * as Location from 'expo-location';
import api from '../api/axios';

const { width } = Dimensions.get('window');

const ClassDetailScreen = ({ route, navigation }) => {
  const { classId, className } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [marking, setMarking] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null); // 'success', 'error'

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || marking) return;
    
    setScanned(true);
    setMarking(true);
    
    try {
      // Get location (optional but recommended)
      let locationData = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({});
          locationData = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude
          };
        }
      } catch (locErr) {
        console.warn('Location access failed', locErr);
      }

      // Get Device ID (using osBuildId or model + brand as fallback)
      const deviceId = Device.osBuildId || `${Device.brand}-${Device.modelName}`;

      // Data from QR is the qrToken
      const response = await api.post('/attendance/mark', { 
        qrToken: data,
        location: locationData,
        deviceId: deviceId
      });
      
      setAttendanceStatus('success');
      Alert.alert('Success', 'Attendance marked successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      setAttendanceStatus('error');
      const msg = err.response?.data?.message || 'Failed to mark attendance';
      Alert.alert('Attendance Failed', msg, [
        { text: 'Try Again', onPress: () => setScanned(false) }
      ]);
    } finally {
      setMarking(false);
    }
  };

  if (!permission) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#0ea5e9" /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera permission is required to scan QR codes</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{className}</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        >
          <View style={styles.overlay}>
             <View style={styles.unfocusedContainer}></View>
             <View style={styles.focusedContainer}>
                <View style={styles.maskOutter}>
                   <View style={styles.maskInner} />
                </View>
             </View>
             <View style={styles.unfocusedContainer}>
                <Text style={styles.instruction}>Align QR code within the frame</Text>
             </View>
          </View>
        </CameraView>
      </View>

      <View style={styles.footer}>
         {marking ? (
           <View style={styles.statusBox}>
              <ActivityIndicator color="#0ea5e9" style={{ marginBottom: 8 }} />
              <Text style={styles.statusText}>Validating code...</Text>
           </View>
         ) : (
           <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Manual Check-in</Text>
              <Text style={styles.infoDesc}>QR codes refresh every 60 seconds. Please scan the latest code on your lecturer's screen.</Text>
           </View>
         )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 8,
  },
  backBtnText: {
    color: '#0ea5e9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  unfocusedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedContainer: {
    height: 250,
    flexDirection: 'row',
  },
  maskOutter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskInner: {
    width: 250,
    height: 250,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  footer: {
    padding: 30,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  infoBox: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  infoDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  statusBox: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  permissionBtn: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ClassDetailScreen;
