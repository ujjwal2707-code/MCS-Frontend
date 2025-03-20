import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {isValidUrl} from '../../../utils/is-valid-url';
import {VirusTotalResponse} from '../../../types/types';
import {fetchScanResults} from '../../../utils/fetch-scan-results';
import {scanUrl} from '../../../utils/scan-url';
import ScanUrlDetails from '../../components/scan-url-details';

const ScanAppUrl = () => {
  const [url, setUrl] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [loading, setLoading] = useState(false);
  
    const [urlDetails, setUrlDetails] = useState<VirusTotalResponse | null>(null);
  
    console.log(urlDetails);
  
    const handleUrlChange = (text: string) => {
      setUrl(text);
      setIsValid(isValidUrl(text));
    };
  
    const handleScan = async () => {
      console.log(url);
      console.log(isValid);
      
      // if (!isValidUrl(url.trim())) {
      //   Alert.alert(
      //     'Error',
      //     'Please enter a valid URL.(e.g., https://example.com,http://example.com)',
      //   );
      //   return;
      // }
      if (!url.trim()) {
        Alert.alert('Error', 'Please enter a valid URL.');
        return;
      }
  
      setLoading(true);
  
      try {
        const scanId = await scanUrl(url);
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}>
          {/* <Text style={styles.navText}>Data Breach</Text> */}

          <View style={styles.userContainer}>
            <TextInput
              style={styles.inputField}
              placeholder="Enter a URL to scan or paste"
              placeholderTextColor="#ccc"
              keyboardType="email-address"
              value={url}
              onChangeText={handleUrlChange}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!url || loading) && styles.disabledButton,
              ]}
              onPress={handleScan}
              disabled={!url || loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Scan</Text>
              )}
            </TouchableOpacity>
          </View>

          {urlDetails && (
            <ScanUrlDetails
              stats={urlDetails?.data.attributes.stats}
              url={urlDetails.meta.url_info.url}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default ScanAppUrl

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    width: '100%',
    paddingHorizontal: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 128,
  },
  navText: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: '#fff',
    alignSelf: 'center',
    marginBottom: 20,
  },
  userContainer: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  inputField: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    // color: '#000',
    marginBottom: 20,
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
