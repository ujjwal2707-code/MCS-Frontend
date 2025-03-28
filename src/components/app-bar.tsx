import React from 'react';
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native';
import CustomText from './ui/custom-text';

interface AppBarProps {
  username: string;
}

const AppBar = ({username}: AppBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.textContainer}>
            <CustomText style={styles.textSmall}>Welcome Back</CustomText>
            <CustomText fontFamily="Montserrat-Bold" style={styles.textLarge}>
              {username}
            </CustomText>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
            marginTop: 16,
          }}>
          <CustomText
            variant="h5"
            fontFamily="Montserrat-Bold"
            color="white"
            style={{textAlign: 'center'}}>
            MahaCyber
          </CustomText>
          <CustomText
            variant="h5"
            fontFamily="Montserrat-Bold"
            color="white"
            style={{textAlign: 'center', color: '#5FFFAE'}}>
            Safe
          </CustomText>
        </View>

        <View style={styles.actions}>
          {/* <Bell color="white" size={20} /> */}
          <Image
            source={require('@assets/images/notify.png')}
            style={styles.notifyImage}
          />
          <View style={styles.sosContainer}>
            <CustomText style={styles.sosText}>SOS</CustomText>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: '100%',
    paddingVertical: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 8,
    justifyContent: 'center',
  },
  textSmall: {
    fontSize: 12,
    color: 'white',
  },
  textLarge: {
    fontSize: 16,
    color: 'white',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom:5
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

export default AppBar;
