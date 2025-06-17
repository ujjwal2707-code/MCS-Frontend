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
import { ScannerResult } from './scanner-result';

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

        {scanResult && (
          <>
            <ScannerResult
              stats={scanResult.stats}
              meta={scanResult.meta}
            />
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ScanUrlResult;

const styles = StyleSheet.create({
  harmlessCard: {
    borderRadius: 20,
    backgroundColor: '#33b5e5', // #eff6ff #33b5e5
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
