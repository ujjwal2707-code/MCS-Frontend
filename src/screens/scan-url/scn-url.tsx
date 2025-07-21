import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {Paths} from '../../navigation/paths';
import {RootScreenProps} from '../../navigation/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import InputField from '@components/ui/input-field';
import CustomText from '@components/ui/custom-text';
import CustomButton from '@components/ui/custom-button';
import {isValidUrl} from '../../../utils/is-valid-url';
import {useMutation} from '@tanstack/react-query';
import {apiService} from '@services/index';
import {DomainReputationResponse, ScanURLResult} from 'types/types';
import ScanUrlResult from '@components/scan-url-result';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import {AlertContext} from '@context/alert-context';
import {CustomToast} from '@components/ui/custom-toast';

type ScanType = 'app' | 'website' | 'payment';

const ScanUrl = ({navigation}: RootScreenProps<Paths.ScanUrl>) => {
  const [appUrl, setAppUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const [isValidApp, setIsValidApp] = useState(true);
  const [isValidWebsite, setIsValidWebsite] = useState(true);
  const [isValidPayment, setIsValidPayment] = useState(true);

  const [loadingScanType, setLoadingScanType] = useState<ScanType | null>(null);
  const [scanUrlDetails, setScanUrlDetails] = useState<DomainReputationResponse | null>(null);
  const [openScanResult, setOpenScanResult] = useState(false);

  // Alert Box
  const {alertSettings, setAlertSetting} = useContext(AlertContext);
  const alertKey = 'scanUrl';
  const [modalVisible, setModalVisible] = useState(true);
  const closeModal = () => setModalVisible(false);
  const handleDontShowAgain = () => {
    setAlertSetting(alertKey, true);
    closeModal();
  };
  useEffect(() => {
    setModalVisible(!alertSettings[alertKey]);
  }, [alertSettings[alertKey]]);

  const handleInputChange = (type: ScanType, text: string) => {
    const valid = isValidUrl(text);
    switch (type) {
      case 'app':
        setAppUrl(text);
        setIsValidApp(valid);
        break;
      case 'website':
        setWebsiteUrl(text);
        setIsValidWebsite(valid);
        break;
      case 'payment':
        setPaymentUrl(text);
        setIsValidPayment(valid);
        break;
    }
  };

  const {mutateAsync: scanUriMutation} = useMutation({
    mutationFn: (values: {inputUrl: string}) => apiService.checkDomainReputation(values),
    onSuccess: res => {
      setScanUrlDetails(res.data);
      setOpenScanResult(true);
    },
    onError: (err: any) => {
      CustomToast.showError('Error', err);
    },
  });

  const handleScanURL = async (scanType: ScanType) => {
    Keyboard.dismiss();

    let urlToScan = '';
    let valid = true;

    if (scanType === 'app') {
      urlToScan = appUrl;
      valid = isValidApp;
    } else if (scanType === 'website') {
      urlToScan = websiteUrl;
      valid = isValidWebsite;
    } else if (scanType === 'payment') {
      urlToScan = paymentUrl;
      valid = isValidPayment;
    }

    if (!urlToScan || !valid) return;

    setLoadingScanType(scanType);
    try {
      await scanUriMutation({inputUrl: urlToScan});
    } catch (error) {
      // handled by onError
    } finally {
      setLoadingScanType(null);
    }
  };

  return (
    <ScreenLayout style={{flex: 1}}>
      <ScreenHeader name="Scan URL" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{paddingHorizontal: 20}}>
              <View style={{paddingVertical: 30}}>
                <CustomText
                  variant="h5"
                  color="#fff"
                  fontFamily="Montserrat-Medium"
                  style={{textAlign: 'center'}}
                >
                  Select type of URL
                </CustomText>
              </View>

              <View style={styles.formSection}>
                <InputField
                  placeholder="Enter Website URL"
                  value={websiteUrl}
                  onChangeText={text => handleInputChange('website', text)}
                />
                {!isValidWebsite && (
                  <CustomText style={styles.errorText}>
                    Please enter a valid URL
                  </CustomText>
                )}
                <CustomButton
                  title="Scan Website"
                  style={styles.button}
                  onPress={() => handleScanURL('website')}
                  isDisabled={!websiteUrl || !isValidWebsite}
                  isLoading={loadingScanType === 'website'}
                />
              </View>

              <View style={styles.formSection}>
                <InputField
                  placeholder="Enter Payment URL"
                  value={paymentUrl}
                  onChangeText={text => handleInputChange('payment', text)}
                />
                {!isValidPayment && (
                  <CustomText style={styles.errorText}>
                    Please enter a valid URL
                  </CustomText>
                )}
                <CustomButton
                  title="Scan Payment"
                  style={styles.button}
                  onPress={() => handleScanURL('payment')}
                  isDisabled={!paymentUrl || !isValidPayment}
                  isLoading={loadingScanType === 'payment'}
                />
              </View>

              <View style={styles.formSection}>
                <InputField
                  placeholder="Enter App URL"
                  value={appUrl}
                  onChangeText={text => handleInputChange('app', text)}
                />
                {!isValidApp && (
                  <CustomText style={styles.errorText}>
                    Please enter a valid URL
                  </CustomText>
                )}
                <CustomButton
                  title="Scan App"
                  style={styles.button}
                  onPress={() => handleScanURL('app')}
                  isDisabled={!appUrl || !isValidApp}
                  isLoading={loadingScanType === 'app'}
                />
              </View>

              
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

      {scanUrlDetails && (
        <ScanUrlResult
          isOpen={openScanResult}
          onClose={() => setOpenScanResult(false)}
          scanResult={scanUrlDetails}
          inputURI={websiteUrl}
        />
      )}

      {modalVisible && (
        <AlertBox
          isOpen={modalVisible}
          onClose={closeModal}
          onDontShowAgain={handleDontShowAgain}
        >
          <CustomText
            fontFamily="Montserrat-Medium"
            style={styles.alertText}
          >
            Hackers inject harmful scripts into websites to steal information. A
            thorough scan of web pages in real time blocks malicious scripts &
            warns against unsafe sites, protecting your device.
          </CustomText>
        </AlertBox>
      )}

      <BackBtn />
    </ScreenLayout>
  );
};

export default ScanUrl;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 60,
  },
  formSection: {
    paddingVertical: 20,
    gap: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  button: {
    width: '50%',
    alignSelf: 'center',
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});
