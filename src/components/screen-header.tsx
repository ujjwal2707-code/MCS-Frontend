import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from './ui/custom-text';

interface ScreenHeaderProps {
  name?: string;
}

const ScreenHeader = ({name}: ScreenHeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="arrow-back" size={30} color="white" />
        <View style={styles.actions}>
          <Image
            source={require('@assets/images/notify.png')}
            style={styles.notifyImage}
          />
          <View style={styles.sosContainer}>
            <CustomText style={styles.sosText}>SOS</CustomText>
          </View>
        </View>
      </View>
      {name && (
        <CustomText
          variant="h5"
          fontFamily="Montserrat-SemiBold"
          color="white"
          style={{textAlign: 'center'}}>
          {name}
        </CustomText>
      )}
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifyImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  sosContainer: {
    width: 28,
    height: 28,
    backgroundColor: '#DC2626',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sosText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
