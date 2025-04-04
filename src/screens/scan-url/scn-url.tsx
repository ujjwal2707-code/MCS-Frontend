import React, {useState} from 'react';
import {View, StyleSheet, Keyboard, Alert} from 'react-native';
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
import {ScanURLResult} from 'types/types';
import ScanUrlResult from '@components/scan-url-result';

type ScanType = 'app' | 'website' | 'payment';

const ScanUrl = ({navigation}: RootScreenProps<Paths.ScanUrl>) => {
  const [appUrl, setAppUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');

  const [isValidApp, setIsValidApp] = useState(true);
  const [isValidWebsite, setIsValidWebsite] = useState(true);
  const [isValidPayment, setIsValidPayment] = useState(true);

  const [loadingScanType, setLoadingScanType] = useState<ScanType | null>(null);
  const [scanUrlDetails, setScanUrlDetails] = useState<ScanURLResult | null>(
    null,
  );
  const [openScanResult, setOpenScanResult] = useState(false);

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
    mutationFn: (values: {inputUrl: string}) => apiService.scanUri(values),
    onSuccess: res => {
      setScanUrlDetails(res.data);
      setOpenScanResult(true);
    },
    onError: (err: any) => {
      Alert.alert("Error",err)
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

    if (!urlToScan || !valid) {
      return;
    }

    setLoadingScanType(scanType);
    try {
      await scanUriMutation({inputUrl: urlToScan});
    } catch (error) {
    } finally {
      setLoadingScanType(null);
    }
  };

  return (
    <ScreenLayout style={{flex: 1}}>
      <ScreenHeader name="Scan URL" />
      <View style={{paddingHorizontal: 20}}>
        <View style={{paddingVertical: 30}}>
          <CustomText
            variant="h5"
            color="#fff"
            fontFamily="Montserrat-Medium"
            style={{textAlign: 'center'}}>
            Select type of URL
          </CustomText>
        </View>

        <View style={styles.formContainer}>
          {/* Scan App */}
          <View style={{paddingVertical: 20, display: 'flex', gap: 10}}>
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
              style={{width: '50%', alignSelf: 'center'}}
              onPress={() => handleScanURL('app')}
              isDisabled={!appUrl || !isValidApp}
              isLoading={loadingScanType === 'app'}
            />
          </View>

          {/* Scan Website */}
          <View style={{paddingVertical: 20, display: 'flex', gap: 10}}>
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
              style={{width: '50%', alignSelf: 'center'}}
              onPress={() => handleScanURL('website')}
              isDisabled={!websiteUrl || !isValidWebsite}
              isLoading={loadingScanType === 'website'}
            />
          </View>

          {/* Scan Payment */}
          <View style={{paddingVertical: 20, display: 'flex', gap: 10}}>
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
              style={{width: '50%', alignSelf: 'center'}}
              onPress={() => handleScanURL('payment')}
              isDisabled={!paymentUrl || !isValidPayment}
              isLoading={loadingScanType === 'payment'}
            />
          </View>
        </View>
      </View>
      {scanUrlDetails && (
        <ScanUrlResult
          isOpen={openScanResult}
          onClose={() => setOpenScanResult(false)}
          scanResult={scanUrlDetails}
        />
      )}
    </ScreenLayout>
  );
};

export default ScanUrl;

const styles = StyleSheet.create({
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});
