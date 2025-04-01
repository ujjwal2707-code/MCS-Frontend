import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';
import {useMutation} from '@tanstack/react-query';
import {apiService} from '@services/index';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@components/ui/custom-text';
import InputField from '@components/ui/input-field';
import CustomButton from '@components/ui/custom-button';

const {width} = Dimensions.get('window');

const ForgetPassword = ({navigation}: RootScreenProps<Paths.ForgetPassword>) => {
  const [email, setEmail] = useState('');

  const {
    mutateAsync: forgetPasswordMutation,
    isPending: forgetPasswordMutationPending,
  } = useMutation({
    mutationFn: (values: {email: string}) => apiService.forgetPassword(values),
    onSuccess: res => {
      Alert.alert('Success', res?.data?.message);
    },
    onError: (err: any) => {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong!',
      );
    },
  });

  const handleForgetPassword = async () => {
    try {
      await forgetPasswordMutation({email});
    } catch (error) {
      console.log('forgetPasswordMutation error', error);
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
                Forgot Password
              </CustomText>
              <InputField
                placeholder="Enter email"
                textContentType="emailAddress"
                value={email}
                onChangeText={value => setEmail(value)}
              />
            </View>

            <View style={styles.buttonSpacing}>
              <CustomButton
                title={
                  forgetPasswordMutationPending ? 'Sending Email...' : 'Reset password'
                }
                textVariant="primary"
                onPress={handleForgetPassword}
                isDisabled={!email}
                isLoading={forgetPasswordMutationPending}
              />
            </View>
            
             <TouchableOpacity
              onPress={() => navigation.navigate(Paths.Login)}
              style={styles.linkSpacingForgetPass}>
              <CustomText
                style={styles.linkText}
                variant="h6"
                fontFamily="Montserrat-Bold">
                Back to log in
              </CustomText>
            </TouchableOpacity>
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
    marginTop: 20,
  },
  linkText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
  }
});

export default ForgetPassword;
