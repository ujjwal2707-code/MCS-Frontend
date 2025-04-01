import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {useMutation} from '@tanstack/react-query';
import {apiService} from '../../services';
import {Paths} from '../../navigation/paths';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@components/ui/custom-text';
import CustomButton from '@components/ui/custom-button';
import OtpInput from '@components/ui/otp-input';

const {width} = Dimensions.get('window');

const VerifyEmail: React.FC<RootScreenProps<Paths.VerifyEmail>> = ({
  route,
  navigation,
}) => {
  const {email} = route.params as {email: string};
  const [otp, setOtp] = useState('');

  const handleOtpSubmit = (enteredOtp: string) => {
    setOtp(enteredOtp);
  };

  const {
    mutateAsync: verifyEmailMutation,
    isPending: verifyEmailMutationPending,
  } = useMutation({
    mutationFn: (values: {email: string; tempOtp: string}) =>
      apiService.verifyEmail(values),
    onSuccess: res => {
      console.log('Verification Successful:', res?.data);
      Alert.alert('Success', 'Email verified!');
      navigation.navigate(Paths.Login);
    },
    onError: (err: any) => {
      console.error('Email Verification Error:', err.response?.data?.message);
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong!',
      );
    },
  });

  const onPressVerify = async () => {
    if (otp.length === 6) {
      try {
        await verifyEmailMutation({email, tempOtp: otp});
      } catch (error) {
        console.error('Verification failed:', error);
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter the full 6-digit OTP.');
    }
  };

  const {mutateAsync: resendOtpMutation, isPending: resendOtpMutationPending} =
    useMutation({
      mutationFn: (values: {email: string}) => apiService.resendOtp(values),
      onSuccess: res => {
        console.log('New otp sent:', res?.data);
        Alert.alert(
          'Success',
          `OTP sent to your mail ${email}.Please check your mail.`,
        );
      },
      onError: (err: any) => {
        Alert.alert(
          'Error',
          err.response?.data?.message || 'Something went wrong!',
        );
      },
    });

  const onPressResendOTP = async () => {
    try {
      await resendOtpMutation({email});
    } catch (error) {
      console.log('resend otp error', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A1D4D', '#08164C']}
        style={styles.gradientBackground}>
        <View style={styles.shadowImageContainer}>
          <Image
            source={require('@assets/images/bgshadow.png')}
            style={styles.shadowImage}
          />
        </View>
        <View style={styles.bottomSection}>
          <ImageBackground
            source={require('@assets/images/bgcircleauth.png')}
            style={styles.splashImage}>
            <Image
              source={require('@assets/images/logoo.png')}
              style={styles.shieldImage}
            />

            <View style={styles.formContainer}>
              <CustomText
                style={{textAlign: 'center'}}
                variant="h4"
                fontFamily="Montserrat-Bold"
                color="#FFFFFF">
                Verify Email
              </CustomText>
              <CustomText
                style={{textAlign: 'center'}}
                variant="h6"
                fontFamily="Montserrat-SemiBold"
                color="#FFFFFF">
                We've sent a verification code to {email}
              </CustomText>

              <OtpInput length={6} onOtpSubmit={handleOtpSubmit} />
            </View>

            <View style={styles.buttonSpacing}>
              <CustomButton
                title={
                  verifyEmailMutationPending ? 'Verifying...' : 'Verify Email'
                }
                textVariant="primary"
                onPress={onPressVerify}
                isDisabled={otp.length < 6}
                isLoading={verifyEmailMutationPending}
              />
            </View>

            <View style={styles.buttonSpacing}>
              <CustomButton
                title={resendOtpMutationPending ? 'Sending...' : 'Resend OTP'}
                textVariant="primary"
                onPress={onPressResendOTP}
                isLoading={resendOtpMutationPending}
              />
            </View>
          </ImageBackground>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

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
    bottom: width * 1.6 + 20,
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
    height: width * 1.4,
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
  formContainer: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: width * 0.2,
  },
  buttonSpacing: {
    marginTop: 22,
  },
  linkSpacing: {
    marginTop: 20,
  },
  linkSpacingForgetPass: {
    marginTop: 10,
  },
  linkText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  linkTextBold: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFE05D',
  },
});

export default VerifyEmail;
