import {Alert, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {ScanURLResult} from 'types/types';
import CustomText from './ui/custom-text';
import {Card} from 'react-native-paper';
import HorizontalBarsChart from './bar-chart';
import CustomButton from './ui/custom-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import {CustomToast} from './ui/custom-toast';
import ScanAnalysis from './scan-analysis';

interface ScanUrlResultProps {
  isOpen: boolean;
  onClose: () => void;
  scanResult: ScanURLResult;
}

const ScanUrlResult = ({isOpen, onClose, scanResult}: ScanUrlResultProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['45%', '90%']}
      index={1}
      enablePanDownToClose={true} // Allows swipe down to close
      onClose={onClose}
      backgroundStyle={{backgroundColor: '#4E4E96'}}>
      <BottomSheetScrollView style={{flex: 1, paddingHorizontal: 20}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            paddingVertical: 10,
          }}>
          <CustomText
            variant="h5"
            color="#fff"
            fontFamily="Montserrat-SemiBold"
            fontSize={18}
            style={{textAlign: 'center'}}>
            {scanResult.meta.url_info.url}
          </CustomText>
          <TouchableOpacity
            onPress={() => copyToClipboard(scanResult.meta.url_info.url)}>
            <MaterialCommunityIcons
              name="content-copy"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {scanResult &&
          (scanResult.stats.harmless + scanResult.stats.undetected >=
          10 * (scanResult.stats.malicious + scanResult.stats.suspicious) ? (
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
                    {scanResult.stats.malicious} malicious threats were detected
                    on this website. It is considered safe by most security
                    checks.
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
                    {scanResult.stats.malicious} malicious threats were detected
                    on this website. This website has been flagged as malicious
                    or suspicious by multiple sources. Please proceed with
                    caution.
                  </CustomText>
                </View>
              </Card.Content>
            </Card>
          ))}

        {/* <Card style={styles.chartContainer}>
          <Card.Content>
            <HorizontalBarsChart stats={scanResult.stats} />
          </Card.Content>
        </Card> */}

        <View style={{flex: 1, marginTop: 16, width: '100%'}}>
          <CustomText
            variant="h4"
            style={{color: '#fff', marginBottom: 12, textAlign: 'center'}}
            fontFamily="Montserrat-Bold">
            Security Analysis Details
          </CustomText>

          <ScanAnalysis
            category="Malicious"
            engines={scanResult.scanners.malicious}
            count={scanResult.stats.malicious}
            color="#ff4444"
          />

          <ScanAnalysis
            category="Suspicious"
            engines={scanResult.scanners.suspicious}
            count={scanResult.stats.suspicious}
            color="#ffbb33"
          />

          <ScanAnalysis
            category="Harmless"
            engines={scanResult.scanners.harmless}
            count={scanResult.stats.harmless}
            color="#00C851"
          />

          <ScanAnalysis
            category="Undetected"
            engines={scanResult.scanners.undetected}
            count={scanResult.stats.undetected}
            color="#33b5e5"
          />
        </View>

        {scanResult &&
          (scanResult.stats.harmless + scanResult.stats.undetected >=
          10 * (scanResult.stats.malicious + scanResult.stats.suspicious) ? (
            <CustomButton
              title="Open Link"
              onPress={() => {
                if (scanResult) {
                  Linking.openURL(scanResult.meta.url_info.url);
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
                if (scanResult) {
                  Linking.openURL(scanResult.meta.url_info.url);
                }
              }}
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: '50%',
                alignSelf: 'center',
              }}
            />
          ))}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ScanUrlResult;

const styles = StyleSheet.create({
  harmlessCard: {
    borderRadius: 20,
    backgroundColor: '#33b5e5',
    marginTop: 20,
    padding: 10,
  },
  maliciousCard: {
    borderRadius: 20,
    backgroundColor: '#33b5e5',
    marginTop: 20,
    padding: 10,
  },
  chartContainer: {
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 20,
  },
});
