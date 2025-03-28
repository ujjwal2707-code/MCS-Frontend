import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {Paths} from '../navigation/paths';
import {RootScreenProps} from '../navigation/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatureTile from '../components/feauture-tile';
import {FeatureTileType} from '../../types/types';
import {useAuth} from '../context/auth-context';
import {apiService} from '../services';
import {useQuery} from '@tanstack/react-query';
import PhoneScan from '../components/phone-scan';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@components/ui/custom-text';
import CustomButton from '@components/ui/custom-button';
import AppBar from '@components/app-bar';

const {width} = Dimensions.get('window');

const Home = ({navigation}: RootScreenProps<Paths.Home>) => {
  const {token} = useAuth();

  // Get user
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      if (!token) throw new Error('Token is missing');

      const response = await apiService.getUserProfile(token);
      if (!response) {
        throw new Error('API call failed: No response received.');
      }
      if (response.status !== 200) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`,
        );
      }
      if (!response.data || !response.data.success) {
        throw new Error('Invalid API response format.');
      }

      return response.data.data;
    },
    staleTime: 0,
    retry: false,
  });
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0A1D4D', '#08164C']} style={styles.gradientBackground}>
        <ImageBackground
          source={require('@assets/images/bgcirclehome.png')}
          style={styles.heroImage}>
          <View style={styles.appBarContainer}>
            <AppBar username={user?.name} />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <CustomText variant="h7" color="white">
                You are
              </CustomText>
              <CustomText
                variant="h5"
                fontFamily="Montserrat-SemiBold"
                color="white">
                83% Secure
              </CustomText>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, {width: '83%'}]} />
              </View>
              <Image
                source={require('@assets/images/secureprotection.png')}
                style={styles.shieldImage}
              />
            </View>
          </View>
          <View style={styles.scanButton}>
            <CustomButton title="SCAN AGAIN" />
          </View>
        </ImageBackground>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical:5
  },
  gradientBackground: {
    flex: 1,
  },
  heroImage: {
    width,
    height: width,
    resizeMode: 'cover',
    position: 'relative'
  },
  appBarContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
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
  },
  progressBarContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#FF0000',
    borderRadius: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#21e6c1',
    borderRadius: 4,
  },
  shieldImage: {
    position: 'absolute',
    left: -15,
    top: -70,
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
  },
  scanButton: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
