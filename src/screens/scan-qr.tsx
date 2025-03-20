import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Button,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {useCodeScanner} from 'react-native-vision-camera';
import {isValidUrl} from '../../utils/is-valid-url';
import ScanQrDetails from '../components/scan-qr-details';
import { RootScreenProps } from '../navigation/types';
import { Paths } from '../navigation/paths';

enum QRTypeState {
  PaymentLink = 'Payment Link',
  WebsiteURL = 'Link',
  ContactCard = 'Contact Card',
  Text = 'Text',
  Unknown = 'Unknown',
}

// Device dimensions and scan rectangle settings.
const {width, height} = Dimensions.get('window');
const SCAN_RECT_WIDTH = width * 0.7;
const SCAN_RECT_HEIGHT = 250;
const SCAN_RECT_LEFT = (width - SCAN_RECT_WIDTH) / 2;
const SCAN_RECT_TOP = (height - SCAN_RECT_HEIGHT) / 2;

const ScanQR = ({navigation}: RootScreenProps<Paths.ScanQr>) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [qrType, setQRType] = useState<QRTypeState>(QRTypeState.Unknown);
  const cameraRef = useRef<Camera>(null);
  const scanningLineAnim = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(false);

  const handleModelOpen = () => {
    setModalVisible(true);
  };

  const handleModelClose = () => {
    setModalVisible(false);
  };

  const {hasPermission, requestPermission} = useCameraPermission();

  const device = useCameraDevice('back');

  useEffect(() => {
    (async () => {
      if (hasPermission) {
        setHasPermissions(true);
      }
    })();
    startLineAnimation();
  }, []);

  const handleScannedData = (data: string) => {
    setScannedData(data);
    const detectedType = detectQRType(data);
    setQRType(detectedType);
    handleModelOpen();
  };

  const detectQRType = (data: string): QRTypeState => {
    if (/upi:\/\/|paypal\.com|paytm\.com|phonepe/.test(data)) {
      return QRTypeState.PaymentLink;
    } else if (isValidUrl(data)) {
      return QRTypeState.WebsiteURL;
    } else if (data.includes('BEGIN:VCARD')) {
      return QRTypeState.ContactCard;
    } else if (data.trim().length > 0) {
      return QRTypeState.Text;
    } else {
      return QRTypeState.Unknown;
    }
  };

  // Use the useCodeScanner hook to handle scanning.
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: any) => {
      if (codes.length > 0 && codes[0].value) {
        // console.log(codes[0].value);
        handleScannedData(codes[0].value);
      }
    },
  });

  console.log(hasPermissions, scannedData, qrType);

  const startLineAnimation = () => {
    scanningLineAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanningLineAnim, {
          toValue: SCAN_RECT_HEIGHT,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scanningLineAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to use the camera
        </Text>
        <Button
          onPress={async () => {
            const status = await requestPermission();
            if (status === true) {
              setHasPermissions(true);
            }
          }}
          title="Grant Permission"
        />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate(Paths.Home)}
      >
        <Text style={styles.closeButtonText}>
          <Ionicons name="close" size={20} color="black" />
        </Text>
      </TouchableOpacity>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
        {/* Overlays for the scan area */}
        <View
          style={[
            styles.overlay,
            {top: 0, left: 0, right: 0, height: SCAN_RECT_TOP},
          ]}
        />
        <View
          style={[
            styles.overlay,
            {
              top: SCAN_RECT_TOP + SCAN_RECT_HEIGHT,
              left: 0,
              right: 0,
              bottom: 0,
            },
          ]}
        />
        <View
          style={[
            styles.overlay,
            {
              top: SCAN_RECT_TOP,
              left: 0,
              width: SCAN_RECT_LEFT,
              height: SCAN_RECT_HEIGHT,
            },
          ]}
        />
        <View
          style={[
            styles.overlay,
            {
              top: SCAN_RECT_TOP,
              left: SCAN_RECT_LEFT + SCAN_RECT_WIDTH,
              right: 0,
              height: SCAN_RECT_HEIGHT,
            },
          ]}
        />
        <View
          style={[
            styles.scanRect,
            {
              left: SCAN_RECT_LEFT,
              top: SCAN_RECT_TOP,
              width: SCAN_RECT_WIDTH,
              height: SCAN_RECT_HEIGHT,
            },
          ]}>
          <View style={styles.scanLineContainer}>
            <Animated.View
              style={[
                styles.scanLine,
                {transform: [{translateY: scanningLineAnim}]},
              ]}
            />
          </View>
        </View>
      </View>
      {scannedData && (
        <ScanQrDetails
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleModelClose={handleModelClose}
          scannedData={scannedData}
          qrType={qrType}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 30,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanRect: {
    position: 'absolute',
    borderWidth: 4,
    borderColor: '#fff',
  },
  scanLineContainer: {
    flex: 1,
    position: 'relative',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'blue',
  },
});

export default ScanQR;
