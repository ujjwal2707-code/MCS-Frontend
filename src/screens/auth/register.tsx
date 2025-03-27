import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {Paths} from '../../navigation/paths';
import {useMutation} from '@tanstack/react-query';
import {apiService} from '../../services';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '@components/ui/custom-text';
import InputField from '@components/ui/input-field';
import CustomButton from '@components/ui/custom-button';

const {width} = Dimensions.get('window');

const Register = ({navigation}: RootScreenProps<Paths.Register>) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const {mutateAsync: registerMutation, isPending: registerMutationPending} =
    useMutation({
      mutationFn: (values: typeof form) => apiService.register(values),
      onSuccess: res => {
        Alert.alert(
          'Success',
          'Registered successfully.We have sent a verification email to your inbox.!',
        );
        navigation.navigate(Paths.VerifyEmail, {email: form.email});
      },
      onError: (err: any) => {
        Alert.alert(
          'Registration Error:',
          err.response?.data?.message || 'Something went wrong!',
        );
      },
    });

  const onSignUpPress = async () => {
    try {
      console.log('Submitting Form:', form);
      await registerMutation(form);
    } catch (error) {
      console.log('Signup Failed:', error);
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
              source={require('@assets/images/logo.png')}
              style={styles.shieldImage}
            />

            <View style={styles.formContainer}>
              <CustomText
                style={{textAlign: 'center'}}
                variant="h4"
                fontFamily="Montserrat-Bold"
                color="#FFFFFF">
                Create your account
              </CustomText>
              <InputField
                placeholder="Enter First Name"
                value={form.firstName}
                onChangeText={value => setForm({...form, firstName: value})}
              />
              <InputField
                placeholder="Enter Last Name"
                value={form.lastName}
                onChangeText={value => setForm({...form, lastName: value})}
              />
              <InputField
                placeholder="Enter email"
                textContentType="emailAddress"
                value={form.email}
                onChangeText={value => setForm({...form, email: value})}
              />
              <InputField
                placeholder="Enter password"
                secureTextEntry={true}
                textContentType="password"
                value={form.password}
                onChangeText={value => setForm({...form, password: value})}
              />
            </View>

            <View style={styles.buttonSpacing}>
              <CustomButton
                title={registerMutationPending ? 'Signing Up...' : 'Sign Up'}
                textVariant="primary"
                onPress={onSignUpPress}
                isDisabled={!form.email && !form.password}
                isLoading={registerMutationPending}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate(Paths.Login)}
              style={styles.linkSpacing}>
              <CustomText
                style={styles.linkText}
                variant="h6"
                fontFamily="Montserrat-SemiBold">
                Already have an account?{' '}
                <CustomText
                  style={styles.linkTextBold}
                  variant="h6"
                  fontFamily="Montserrat-SemiBold">
                  Sign In
                </CustomText>
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

export default Register;
