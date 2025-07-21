import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {useCodeScanner} from 'react-native-vision-camera';
import {isValidUrl} from '../../utils/is-valid-url';
import {RootScreenProps} from '../navigation/types';
import {Paths} from '../navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import Loader from '@components/loader';
import CustomText from '@components/ui/custom-text';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CustomButton from '@components/ui/custom-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DomainReputationResponse, ScanURLResult} from 'types/types';
import {useMutation} from '@tanstack/react-query';
import {apiService} from '@services/index';
import {Card} from 'react-native-paper';
import HorizontalBarsChart from '@components/bar-chart';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import {AlertContext} from '@context/alert-context';
import {CustomToast} from '@components/ui/custom-toast';
import ScanAnalysis from '@components/scan-analysis';
import {ScannerResult} from '@components/scanner-result';

enum QRTypeState {
  PaymentLink = 'Payment Link',
  WebsiteURL = 'Link',
  ContactCard = 'Contact Card',
  Text = 'Text',
  Unknown = 'Unknown',
}

const {width} = Dimensions.get('window');

const ScanQR = ({navigation}: RootScreenProps<Paths.ScanQr>) => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [qrType, setQRType] = useState<QRTypeState>(QRTypeState.Unknown);
  const cameraRef = useRef<Camera>(null);

  const [openScanResult, setOpenScanResult] = useState(false);

  // Alert Box
  const {alertSettings, setAlertSetting} = useContext(AlertContext);
  const alertKey = 'scanQr';
  const [modalVisible, setModalVisible] = useState(true);
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleDontShowAgain = () => {
    setAlertSetting(alertKey, true);
    closeModal();
  };
  useEffect(() => {
    setModalVisible(!alertSettings[alertKey]);
  }, [alertSettings[alertKey]]);

  const {hasPermission, requestPermission} = useCameraPermission();

  const device = useCameraDevice('back');

  useEffect(() => {
    (async () => {
      if (hasPermission) {
        setHasPermissions(true);
      }
    })();
  }, []);

  const handleScannedData = (data: string) => {
    setScannedData(data);
    const detectedType = detectQRType(data);
    setQRType(detectedType);
    setOpenScanResult(true);
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

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <CustomText
          variant="h5"
          color="#fff"
          style={styles.permissionText}
          fontFamily="Montserrat-Bold">
          We need your permission to use the camera.
        </CustomText>
        <CustomButton
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
    return <Loader />;
  }

  return (
    <ScreenLayout>
      <ScreenHeader name="QR Code Scanner" />
      <View style={styles.scannerContainer}>
        <View style={styles.scannerInnerContainer}>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            codeScanner={codeScanner}
          />
        </View>
      </View>
      {scannedData && (
        <ScanQRResult
          isOpen={openScanResult}
          onClose={() => setOpenScanResult(false)}
          scannedData={scannedData}
          qrType={qrType}
        />
      )}

      {modalVisible && (
        <AlertBox
          isOpen={modalVisible}
          onClose={closeModal}
          onDontShowAgain={handleDontShowAgain}>
          <CustomText
            fontFamily="Montserrat-Medium"
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 20,
            }}>
            Malicious QR codes can redirect you to phishing websites or install
            malware on your device. Scanning QR codes before opening them
            ensures they are safe and free from cyber threats.
          </CustomText>
        </AlertBox>
      )}

      <BackBtn />
    </ScreenLayout>
  );
};

const SCAN_SIZE = width * 0.8;

export default ScanQR;

// ScanQRResult Component
interface ScanQRResultProps {
  isOpen: boolean;
  onClose: () => void;
  scannedData: string;
  qrType: string;
}
const ScanQRResult = ({
  isOpen,
  onClose,
  scannedData,
  qrType,
}: ScanQRResultProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [scanUrlDetails, setScanUrlDetails] =
    useState<DomainReputationResponse | null>(null);

  useEffect(() => {
    setScanUrlDetails(null);
  }, [scannedData]);

  const {mutateAsync: scanUriMutation, isPending: scanUriMutationPending} =
    useMutation({
      mutationFn: (values: {inputUrl: string}) =>
        apiService.checkDomainReputation(values),
      onSuccess: res => {
        setScanUrlDetails(res.data);
      },
      onError: (err: any) => {
        CustomToast.showError('Error', err);
      },
    });

  const handleScanURL = async () => {
    try {
      await scanUriMutation({inputUrl: scannedData});
    } catch (error) {}
  };

  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    CustomToast.showInfo(
      'Copied',
      'The data has been copied to your clipboard!',
    );
  };

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // const ScannerCategorySection = ({
  //   category,
  //   engines,
  //   count,
  //   color,
  // }: {
  //   category: string;
  //   engines: string[];
  //   count: number;
  //   color: string;
  // }) => {
  //   const isExpanded =
  //     expandedCategories[
  //       category.toLowerCase() as keyof typeof expandedCategories
  //     ];

  //   return (
  //     <Card style={[styles.categoryCard, {backgroundColor: color}]}>
  //       <TouchableOpacity
  //         onPress={() =>
  //           toggleCategory(
  //             category.toLowerCase() as keyof typeof expandedCategories,
  //           )
  //         }
  //         style={styles.categoryHeader}>
  //         <View style={styles.categoryTitle}>
  //           <CustomText variant="h5" fontFamily="Montserrat-Bold">
  //             {category} ({count})
  //           </CustomText>
  //           {/* <MaterialIcons
  //             name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
  //             size={24}
  //             color="#fff"
  //           /> */}
  //         </View>
  //       </TouchableOpacity>

  //       {isExpanded && (
  //         <ScrollView
  //           style={styles.engineScrollView}
  //           nestedScrollEnabled={true}
  //           showsVerticalScrollIndicator={false}>
  //           <View style={styles.engineList}>
  //             {engines.map((engine, index) => (
  //               <View key={index} style={styles.engineItem}>
  //                 <CustomText variant="h6" color="#fff">
  //                   {engine}
  //                 </CustomText>
  //               </View>
  //             ))}
  //           </View>
  //         </ScrollView>
  //       )}

  //     </Card>
  //   );
  // };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['45%', '90%']}
      index={1}
      enablePanDownToClose={true} // Allows swipe down to close
      onClose={onClose}
      backgroundStyle={{backgroundColor: '#4E4E96'}}>
      <BottomSheetScrollView style={{flex: 1, paddingHorizontal: 20}}>
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-sharp"
            size={24}
            color="#fff"
            style={styles.infoIcon}
          />
          {qrType === 'Payment Link' ? (
            <CustomText
              variant="h5"
              color="#fff"
              fontFamily="Montserrat-SemiBold">
              This QR is a {qrType}. Verify sender before proceeding.
            </CustomText>
          ) : (
            <CustomText
              variant="h5"
              color="#fff"
              fontFamily="Montserrat-SemiBold">
              This QR is a {qrType}.
            </CustomText>
          )}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            paddingVertical: 5,
          }}>
          <CustomText
            variant="h5"
            color="#fff"
            fontFamily="Montserrat-SemiBold"
            fontSize={18}
            style={{textAlign: 'center'}}>
            {scannedData}
          </CustomText>
          <TouchableOpacity onPress={() => copyToClipboard(scannedData)}>
            <MaterialCommunityIcons
              name="content-copy"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {qrType === 'Link' && (
          <CustomButton
            title="Scan URL"
            style={{width: '50%', alignSelf: 'center'}}
            onPress={handleScanURL}
            isLoading={scanUriMutationPending}
            isDisabled={!scannedData}
          />
        )}

        {qrType === 'Payment Link' && (
          <CustomButton
            title="Scan URL"
            style={{width: '50%', alignSelf: 'center'}}
            onPress={handleScanURL}
            isLoading={scanUriMutationPending}
            isDisabled={!scannedData}
          />
        )}

        {/** Scan Result Analysis */}

        {scanUrlDetails && (
          <>
            <View style={{paddingVertical: 20}}>
              <ScannerResult inputURI={scannedData} data={scanUrlDetails} />
            </View>
            {/* {scanUrlDetails &&
              (scanUrlDetails.stats.harmless +
                scanUrlDetails.stats.undetected >=
              10 *
                (scanUrlDetails.stats.malicious +
                  scanUrlDetails.stats.suspicious) ? (
                <Card style={styles.harmlessCard}>
                  <Card.Content>
                    <View>
                      <CustomText
                        variant="h5"
                        color="#fff"
                        fontFamily="Montserrat-Bold"
                        style={{textAlign: 'center'}}>
                        Safe & Harmless Link
                      </CustomText>
                      <CustomText
                        variant="h5"
                        color="#fff"
                        fontFamily="Montserrat-Bold"
                        style={{textAlign: 'center'}}>
                        {scanUrlDetails.stats.malicious} malicious threats were
                        detected on this website. It is considered safe by most
                        security checks.
                      </CustomText>
                    </View>
                  </Card.Content>
                </Card>
              ) : (
                <Card style={styles.maliciousCard}>
                  <Card.Content>
                    <View>
                      <CustomText
                        variant="h5"
                        color="#fff"
                        fontFamily="Montserrat-Bold"
                        style={{textAlign: 'center'}}>
                        Suspected Fraud or Malicious Link
                      </CustomText>
                      <CustomText
                        variant="h5"
                        color="#fff"
                        fontFamily="Montserrat-Bold"
                        style={{textAlign: 'center'}}>
                        {scanUrlDetails.stats.malicious} malicious threats were
                        detected on this website. This website has been flagged
                        as malicious or suspicious by multiple sources. Please
                        proceed with caution.
                      </CustomText>
                    </View>
                  </Card.Content>
                </Card>
              ))} */}

            {/* <Card style={styles.chartContainer}>
              <Card.Content>
                <HorizontalBarsChart stats={scanUrlDetails?.stats!} />
              </Card.Content>
            </Card> */}

            {/** Scanners */}

            {/* <View style={{flex: 1, marginTop: 16, width: '100%'}}>
              <CustomText
                variant="h4"
                style={{color: '#fff', marginBottom: 12, textAlign: 'center'}}
                fontFamily="Montserrat-Bold">
                Security Analysis Details
              </CustomText>

              <ScanAnalysis
                category="Malicious"
                engines={scanUrlDetails.scanners.malicious}
                count={scanUrlDetails.stats.malicious}
                color="#ff4444"
              />

              <ScanAnalysis
                category="Suspicious"
                engines={scanUrlDetails.scanners.suspicious}
                count={scanUrlDetails.stats.suspicious}
                color="#ffbb33"
              />

              <ScanAnalysis
                category="Harmless"
                engines={scanUrlDetails.scanners.harmless}
                count={scanUrlDetails.stats.harmless}
                color="#00C851"
              />

              <ScanAnalysis
                category="Undetected"
                engines={scanUrlDetails.scanners.undetected}
                count={scanUrlDetails.stats.undetected}
                color="#33b5e5"
              />
            </View> */}

            {/* {scanUrlDetails &&
              (scanUrlDetails.stats.harmless +
                scanUrlDetails.stats.undetected >=
              10 *
                (scanUrlDetails.stats.malicious +
                  scanUrlDetails.stats.suspicious) ? (
                <CustomButton
                  title="Open Link"
                  onPress={() => {
                    if (scanUrlDetails) {
                      Linking.openURL(scanUrlDetails.meta.url_info.url);
                    }
                  }}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: '50%',
                    alignSelf: 'center',
                  }}
                />
              ) : (
                <CustomButton
                  bgVariant="danger"
                  textVariant="danger"
                  title="Open Link"
                  onPress={() => {
                    if (scanUrlDetails) {
                      Linking.openURL(scanUrlDetails.meta.url_info.url);
                    }
                  }}
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    width: '50%',
                    alignSelf: 'center',
                  }}
                />
              ))} */}
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    backgroundColor: '#080460',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 10,
  },
  scannerContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: width * 0.2,
    marginTop: 20,
  },
  scannerInnerContainer: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: 24,
    borderColor: '#2337A8', // #2337A8
    borderWidth: 4,
    backgroundColor: '#000000', // #000000
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
    justifyContent: 'center',
    marginTop: 10,
  },
  infoIcon: {
    marginRight: 8,
  },
  harmlessCard: {
    borderRadius: 20,
    backgroundColor: '#33b5e5', // #4E4E96 #5DFFAE
    marginTop: 20,
    padding: 10,
  },
  maliciousCard: {
    borderRadius: 20,
    backgroundColor: '#33b5e5', // #FE3A39
    marginTop: 20,
    padding: 10,
  },
  chartContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 20,
  },
});
