import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {VirusTotalResponse} from '../../types/types';
import {scanUrl} from '../../utils/scan-url';
import {fetchScanResults} from '../../utils/fetch-scan-results';
import ScanUrlDetails from './scan-url-details';

interface ScannedDataDetailsProps {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  handleModelClose: () => void;
  scannedData: string;
  qrType: string;
}

const ScanQrDetails = ({
  modalVisible,
  setModalVisible,
  handleModelClose,
  scannedData,
  qrType,
}: ScannedDataDetailsProps) => {
  const [loading, setLoading] = useState(false);

  const [urlDetails, setUrlDetails] = useState<VirusTotalResponse | null>(null);

  const handleScan = async () => {
    setLoading(true);

    try {
      const scanId = await scanUrl(scannedData);
      console.log('Scan ID:', scanId);

      let scanResults;
      let retries = 10;
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

      do {
        scanResults = await fetchScanResults(scanId);
        console.log('API Status:', scanResults.data.attributes.status);

        if (scanResults.data.attributes.status === 'completed') {
          setUrlDetails(scanResults);
          break;
        }

        await delay(2000); // Wait for 2 seconds before retrying
        retries--;
      } while (
        scanResults.data.attributes.status !== 'completed' &&
        retries > 0
      );

      if (scanResults.data.attributes.status !== 'completed') {
        Alert.alert(
          'Error',
          'Scan did not complete in time. Please try again later.',
        );
      }
    } catch (error: any) {
      Alert.alert('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalContainer}>
        <View style={styles.contentContainer}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleModelClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-sharp"
              size={24}
              color="blue"
              style={styles.infoIcon}
            />
            {qrType === 'Payment Link' ? (
              <Text style={styles.infoText}>
                This QR is a {qrType}. Verify sender before proceeding.
              </Text>
            ) : (
              <Text style={styles.infoText}>This QR is a {qrType}</Text>
            )}
          </View>

          {/* Scanned Data */}
          <View style={styles.dataContainer}>
            <View style={styles.dataRow}>
              <Text style={styles.scannedText}>{scannedData}</Text>
              <TouchableOpacity style={{marginLeft: 6}}>
                <Ionicons name="copy-sharp" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* URL Handling */}
          {qrType === 'Link' && (
            <>
              <TouchableOpacity
                style={[
                  styles.linkButton,
                  (!scannedData || loading) && styles.disabledButton,
                ]}
                onPress={handleScan}
                disabled={!scannedData || loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.linkButtonText}>Scan this Link</Text>
                )}
              </TouchableOpacity>
              {urlDetails && (
                <ScanUrlDetails
                  stats={urlDetails?.data.attributes.stats}
                  url={urlDetails.meta.url_info.url}
                />
              )}
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ScanQrDetails;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    // backgroundColor: '#6B7280',
    padding: 8,
    borderRadius: 999,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#007BFF',
    width: '100%',
    justifyContent: 'center',
    marginTop: 40,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    color: '#007BFF',
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
  },
  dataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
    width: '100%',
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scannedText: {
    fontFamily: 'Rubik-SemiBold',
    fontSize: 14,
    color: '#9CA3AF',
  },
  copyIcon: {
    marginLeft: 10,
  },
  linkButton: {
    width: '100%',
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  linkButtonText: {
    color: '#fff',
    fontFamily: 'Rubik-SemiBold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#87cefa',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
