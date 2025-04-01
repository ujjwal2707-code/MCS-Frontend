import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useEffect} from 'react';
import {useAuth} from '@context/auth-context';
import CustomText from '@components/ui/custom-text';
import LinearGradient from 'react-native-linear-gradient';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';

const {width} = Dimensions.get('window');

const SplashScreen = ({navigation}: RootScreenProps<Paths.SplashScreen>) => {
  const {token} = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      // navigation.replace(token ? Paths.Home : Paths.Login);
      navigation.replace(token ? 'MainTabs' : Paths.Login);
    }, 1500);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A1D4D', '#08164C']}
        style={styles.gradientBackground}>
        <View style={styles.textContainer}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 10,
              marginBottom: 4,
            }}>
            <CustomText
              variant="h1"
              fontFamily="Montserrat-Bold"
              color="white"
              style={{textAlign: 'center'}}>
              MahaCyber
            </CustomText>
            <CustomText
              variant="h1"
              fontFamily="Montserrat-Bold"
              color="white"
              style={{textAlign: 'center', color: '#5FFFAE'}}>
              Safe
            </CustomText>
          </View>

          <CustomText
            variant="h6"
            color="#FFFFFF"
            style={{textAlign: 'center'}}>
            Powered by
          </CustomText>
        </View>

        <View style={styles.shadowImageContainer}>
          <Image
            source={require('@assets/images/bgshadow.png')}
            style={styles.shadowImage}
          />
        </View>

        <View style={styles.bottomSection}>
          <ImageBackground
            source={require('@assets/images/bgcirclesplash.png')}
            style={styles.splashImage}>
            <Image
              source={require('@assets/images/logoo.png')}
              style={styles.shieldImage}
            />
            <View style={styles.textBelow}>
              <CustomText
                variant="h5"
                fontFamily="Montserrat-SemiBold"
                color="#FFFFFF">
                Created by NSO
              </CustomText>
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    bottom: width * 1.1 + 10,
    alignSelf: 'center',
  },
  shadowImageContainer: {
    position: 'absolute',
    bottom: width * 1 + 5,
    alignSelf: 'center',
  },
  shadowImage: {
    width: width * 0.8,
    height: width * 0.8,
    position: 'absolute',
    top: -(width * 0.15),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  splashImage: {
    width: width,
    height: width * 0.8,
    resizeMode: 'cover',
    alignItems: 'center',
  },
  shieldImage: {
    width: width * 0.3,
    height: width * 0.3,
    position: 'absolute',
    top: -(width * 0.15),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  textBelow: {
    marginTop: width * 0.2,
  },
});

