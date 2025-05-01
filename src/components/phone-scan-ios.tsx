import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomText from './ui/custom-text';
import CustomButton from './ui/custom-button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/types';
import {Paths} from '@navigation/paths';
import {useDataBreachChecker} from '../hooks/useDataBreachChecker';
import {useQuery} from '@tanstack/react-query';
import {useAuth} from '@context/auth-context';
import {apiService} from '@services/index';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, Paths.Home>;

const PhoneScanIos = () => {
  const navigation = useNavigation<NavigationProp>();
  const [displayRating, setDisplayRating] = useState(0);
  const [animationResetTrigger, setAnimationResetTrigger] = useState(0);
  const ratingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const {token} = useAuth();
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

  const {loading, resultData, checkDataBreach} = useDataBreachChecker();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    const init = async () => {
      await checkDataBreach(user?.email);
    };
    init();
  }, [user]);

  const breachCount = resultData?.breaches?.flat()?.length || 0;
  const securityRating = Math.max(0, 100 - breachCount * 10);

  useEffect(() => {
    ratingAnim.setValue(0);
    setAnimationResetTrigger(prev => prev + 1);
    Animated.timing(ratingAnim, {
      toValue: securityRating,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = ratingAnim.addListener(({value}) => {
      setDisplayRating(value);
    });

    return () => ratingAnim.removeListener(listener);
  }, [securityRating]);

  const handleSecurePhonePress = () => {
    navigation.navigate(Paths.PhoneScan);
  };

  return (
    <>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <CustomText variant="h7" color="white">
            You are
          </CustomText>
          <View style={styles.animatedTextContainer}>
            <CustomText
              variant="h5"
              fontFamily="Montserrat-SemiBold"
              color="white">
              {displayRating.toFixed(2)}% Secure
            </CustomText>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <ProgressBar
            securityRating={securityRating}
            resetTrigger={animationResetTrigger}
          />
          <Animated.Image
            source={require('@assets/images/secure.png')}
            style={[styles.shieldImage, {transform: [{scale: pulseAnim}]}]}
          />
        </View>
      </View>
      <View style={styles.scanButton}>
        {loading ? (
          <ActivityIndicator size="large" color="#21e6c1" />
        ) : (
          <CustomButton title="SCAN" onPress={handleSecurePhonePress} />
        )}
      </View>
    </>
  );
};

interface ProgressBarProps {
  securityRating: number;
  resetTrigger: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  securityRating,
  resetTrigger,
}) => {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerWidth) return;
    fillAnim.setValue(0);
    const targetWidth = (securityRating / 100) * (containerWidth * 0.85);

    Animated.timing(fillAnim, {
      toValue: targetWidth,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [resetTrigger, containerWidth]);

  return (
    <View
      style={styles.progressBar}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      <View style={styles.progressBackground} />
      <Animated.View style={[styles.progressFill, { width: fillAnim }]}>
        <LinearGradient
          colors={['#21e6c1', '#1acba3']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.gradientFill}
        />
      </Animated.View>
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
  animatedTextContainer: {
    position: 'relative',
    marginTop: 4,
  },
  progressBarContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  progressBar: {
    width: '100%',
    height: 14,
    position: 'relative',
    overflow: 'hidden', // Changed from 'visible'
  },
  progressBackground: {
    position: 'absolute',
    left: '15%',
    right: 0,
    height: '100%',
    backgroundColor: '#FF0000', // #FF0000
    borderRadius: 8,
    zIndex: 1, // Add z-index
  },
  progressFill: {
    position: 'absolute',
    left: '15%',
    height: '100%',
    zIndex: 2, // Higher than background
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor:"#21e6c1"
  },
  gradientFill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  shieldImage: {
    position: 'absolute',
    left: -15,
    top: -70,
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
    zIndex: 2,
  },
  scanButton: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default PhoneScanIos;
