import {
  Dimensions,
  DimensionValue,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import CustomText from './ui/custom-text';
import CustomButton from './ui/custom-button';

const {width} = Dimensions.get('window');

const PhoneScanIos = () => {
  const handleSecurePhonePress = () => {};
  const securityRating = '67.06';
  return (
    <>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <CustomText variant="h7" color="white">
            You are
          </CustomText>
          <CustomText
            variant="h5"
            fontFamily="Montserrat-SemiBold"
            color="white">
            {securityRating}% Secure
          </CustomText>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar securityRating={securityRating} />
          <Image
            source={require('@assets/images/secure.png')}
            style={styles.shieldImage}
          />
        </View>
      </View>
      <View style={styles.scanButton}>
        <CustomButton title="SCAN" onPress={handleSecurePhonePress} />
      </View>
    </>
  );
};

export default PhoneScanIos;

interface ProgressBarProps {
  securityRating: number | string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({securityRating}) => {
  const ratingValue =
    typeof securityRating === 'string'
      ? parseFloat(securityRating.replace('%', ''))
      : securityRating;

  const fillWidth: DimensionValue = `${(ratingValue / 100) * 85 + 10}%`;

  return (
    <View style={styles.progressBar}>
      <View style={styles.progressBackground} />
      <View style={[styles.progressFill, {width: fillWidth}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    position: 'absolute',
    top: 20,
    bottom: 80,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginBottom: 8,
    marginLeft: 50,
  },
  progressBarContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressBar: {
    width: '100%',
    height: 8,
    position: 'relative',
    overflow: 'visible',
  },
  progressBackground: {
    position: 'absolute',
    left: '15%', // Match shield overlap
    right: 0,
    height: '100%',
    backgroundColor: '#FF0000', // #FF0000
    borderRadius: 8,
  },
  progressFill: {
    position: 'absolute',
    left: '15%',
    height: '100%',
    backgroundColor: '#21e6c1', // #21e6c1
    borderRadius: 4,
    zIndex: 1,
  },
  shieldImage: {
    position: 'absolute',
    left: -15, // Original position
    top: -70, // Original position
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
    zIndex: 2, // Keep shield above everything
  },
  scanButton: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
