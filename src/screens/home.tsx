import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '@navigation/bottom-tab-params';
import {
  featureTilesDataAndroid,
  featureTilesDataIos,
} from '@constants/feature-tiles';
import PhoneSecurityScan from '@components/phone-security-scan';

const {width} = Dimensions.get('window');

type HomeProps = BottomTabScreenProps<BottomTabParamList, Paths.Home>;

const Home: React.FC<HomeProps> = ({navigation, route}) => {
  const {token} = useAuth();

  // Get user
  const {data: user} = useQuery({
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
    <View style={styles.container}>
      {/* <StatusBar hidden={Platform.OS !== 'android'} /> */}
      <LinearGradient
        colors={['#0A1D4D', '#08164C']}
        style={StyleSheet.absoluteFill}></LinearGradient>
      <SafeAreaView style={[styles.SafeAreaViewcontainer]}>
        <View style={{flex: 1}}>
          <ImageBackground
            source={require('@assets/images/homehero.png')}
            style={styles.heroImage}>
            <View style={styles.appBarContainer}>
              <AppBar username={user?.name} />
            </View>
            {Platform.OS === 'android' && <PhoneSecurityScan />}
          </ImageBackground>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContainer}>
            {/* {Platform.OS === 'android' ? (
              <FlatList
                data={featureTilesDataAndroid}
                keyExtractor={item => item.id}
                numColumns={3}
                contentContainerStyle={{paddingHorizontal: 10}}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                renderItem={({item}) => (
                  <FeatureTile
                    icon={item.icon}
                    image={item.image!}
                    label={item.label}
                    onPress={() => {
                      console.log('Navigating to:', item.route);
                      navigation.navigate(item.route);
                    }}
                  />
                )}
                scrollEnabled={false}
              />
            ) : (
              <FlatList
                data={featureTilesDataIos}
                keyExtractor={item => item.id}
                numColumns={3}
                contentContainerStyle={{paddingHorizontal: 10}}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                renderItem={({item}) => (
                  <FeatureTile
                    icon={item.icon}
                    image={item.image!}
                    label={item.label}
                    onPress={() => {
                      console.log('Navigating to:', item.route);
                      navigation.navigate(item.route);
                    }}
                  />
                )}
                scrollEnabled={false}
              />
            )} */}
            <FlatList
                data={featureTilesDataAndroid}
                keyExtractor={item => item.id}
                numColumns={3}
                contentContainerStyle={{paddingHorizontal: 10}}
                columnWrapperStyle={{justifyContent: 'space-between'}}
                renderItem={({item}) => (
                  <FeatureTile
                    icon={item.icon}
                    image={item.image!}
                    label={item.label}
                    onPress={() => {
                      console.log('Navigating to:', item.route);
                      navigation.navigate(item.route);
                    }}
                  />
                )}
                scrollEnabled={false}
              />
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  SafeAreaViewcontainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  heroImage: {
    width,
    height: width,
    resizeMode: 'contain',
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
  scrollView: {
    position: 'absolute',
    top: width * 0.9,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrollContainer: {
    paddingBottom: 10,
  },
});