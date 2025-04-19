import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React from 'react';
import CustomText from './ui/custom-text';

interface FeatureTileProps {
  icon: React.ReactNode;
  image: ImageSourcePropType;
  label: string;
  onPress: () => void;
}

const FeatureTile = ({icon, label, image, onPress}: FeatureTileProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={image} style={styles.iconImg} />
      </View>
      <View>
        {Platform.OS === 'android' ? (
          <CustomText
            fontFamily="Montserrat-SemiBold"
            fontSize={10}
            color="#FFF"
            style={{textAlign: 'center'}}>
            {label}
          </CustomText>
        ) : (
          <CustomText
            fontFamily="Montserrat-SemiBold"
            fontSize={12}
            color="#FFF"
            style={{textAlign: 'center'}}>
            {label}
          </CustomText>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default FeatureTile;

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      android: {
        width: '30%',
      },
      ios: {
        width: '30%',
      },
    }),
    marginTop: 4,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#4E4E96', // #4E4E96
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    borderWidth: 1,
    padding: 20,
  },
  iconImg: {
    ...Platform.select({
      android: {
        width: 30,
        height: 30,
      },
      ios: {
        width: 45,
        height: 45,
      },
    }),
    resizeMode: 'contain',
  },
});
