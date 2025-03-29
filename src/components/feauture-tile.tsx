import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
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
        {image ? <Image source={image} style={styles.iconImg} /> : <>{icon}</>}
      </View>

      <View>
        <CustomText
          fontFamily="Montserrat-SemiBold"
          fontSize={10}
          color="#FFF"
          style={{textAlign: 'center'}}>
          {label}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
};

export default FeatureTile;

const styles = StyleSheet.create({
  container: {
    width: '30%',
    marginTop: 4,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#4E4E96',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    borderWidth: 1,
    padding: 20,
  },
  iconImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  // container: {
  //   width: '30%',
  //   height: 112,
  //   padding: 8,
  //   marginTop:5,
  //   borderRadius: '100%',
  //   borderWidth: 1,
  //   backgroundColor: '#4E4E96',
  //   elevation: 5,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // text: {
  //   color: '#FFF',
  //   fontSize: 14,
  //   marginTop: 8,
  //   textAlign: 'center',
  //   fontFamily: 'Rubik',
  // },
});

{
  /* <TouchableOpacity style={styles.container} onPress={onPress}>
      {icon}
      {}
      <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
        {label}
      </Text>
    </TouchableOpacity> */
}
