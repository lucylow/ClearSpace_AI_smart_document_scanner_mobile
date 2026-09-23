import { useRef, useState } from 'react';
import { Alert, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { safeErrorMessage } from '@/src/core/errors/errorMessage';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCaptured: (uri: string) => void;
};

export function ReviewCameraModal({ visible, onClose, onCaptured }: Props) {
  const ref = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [error, setError] = useState('');

  const allowCamera = async () => {
    setError('');
    try {
      await requestPermission();
    } catch (reason) {
      setError(`Camera permission could not be requested. ${safeErrorMessage(reason, 'Check device settings and try again.')}`);
    }
  };

  const capture = async () => {
    setError('');
    try {
      if (Platform.OS === 'web') {
        onCaptured(`demo://page-${Date.now()}`);
        return;
      }
      if (!permission?.granted) {
        setError('Camera access is required before capturing a page.');
        return;
      }
      const camera = ref.current;
      if (!camera) {
        setError('The camera is still starting. Please wait a moment and try again.');
        return;
      }
      const photo = await camera.takePictureAsync({ quality: 0.9, skipProcessing: false });
      if (!photo?.uri) {
        setError('The camera returned no image. Please try again.');
        return;
      }
      onCaptured(photo.uri);
    } catch (reason) {
      const message = `Capture failed. ${safeErrorMessage(reason, 'Please try again.')}`;
      setError(message);
      Alert.alert('Could not capture page', message);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>
        {Platform.OS !== 'web' && permission?.granted ? (
          <CameraView ref={ref} style={StyleSheet.absoluteFill} facing="back" mute />
        ) : (
          <View style={styles.web}>
            <Text style={styles.webTitle}>{permission ? 'Camera access is needed' : 'Preparing camera…'}</Text>
            {permission && !permission.granted ? (
              <Pressable style={styles.allow} onPress={() => void allowCamera()}>
                <Text style={styles.allowText}>Allow camera</Text>
              </Pressable>
            ) : null}
          </View>
        )}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.controls}>
          <Pressable style={styles.close} onPress={onClose}>
            <Text style={styles.controlText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.shutter} onPress={() => void capture()}>
            <View style={styles.shutterInner} />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050914' },
  web: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111C2F' },
  webTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  allow: { marginTop: 16, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, backgroundColor: '#4F46E5' },
  allowText: { color: '#fff', fontWeight: '800' },
  error: { position: 'absolute', top: 40, left: 20, right: 20, padding: 12, borderRadius: 12, color: '#FFF', backgroundColor: '#B42318', textAlign: 'center' },
  controls: { position: 'absolute', bottom: 36, width: '100%', alignItems: 'center' },
  close: { position: 'absolute', left: 24, bottom: 20, padding: 12 },
  controlText: { color: '#fff', fontWeight: '800' },
  shutter: { width: 76, height: 76, borderRadius: 38, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  shutterInner: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#fff' },
});
