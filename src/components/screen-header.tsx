import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from './ui/custom-text';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '@navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

interface ScreenHeaderProps {
  name?: string;
}

const ScreenHeader = ({name}: ScreenHeaderProps) => {
  // const navigation =
  //   useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require('@assets/images/notification.png')}
            style={styles.notifyImage}
          />
          <View style={styles.sosContainer}>
            <CustomText style={styles.sosText}>SOS</CustomText>
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
      {/* <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
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
    </View> */}
    </>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    width:'100%',
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
