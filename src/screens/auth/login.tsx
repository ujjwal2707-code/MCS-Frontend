import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';
import {useMutation} from '@tanstack/react-query';
import {useAuth} from '@context/auth-context';
import {apiService} from '@services/index';
import CustomText from '@components/ui/custom-text';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '@components/ui/custom-button';
import InputField from '@components/ui/input-field';

const {width} = Dimensions.get('window');

const Login = ({navigation}: RootScreenProps<Paths.Login>) => {
  const {setAuthToken} = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const {mutateAsync: loginMutation, isPending: loginMutationPending} =
    useMutation({
      mutationFn: (values: typeof form) => apiService.login(values),
      onSuccess: async res => {
        console.log('Login Successfull:', res?.data);
        if (!res?.data?.varified) {
          navigation.navigate(Paths.VerifyEmail, {email: form.email});
        }
        if (res.data.token) {
          await setAuthToken(res.data.token);
        }
        Alert.alert('Success', 'Login Successfull!');
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{name: Paths.Home}],
        //   }),
        // );
      },
      onError: (err: any) => {
        // console.log(err, 'errrrrrrrr');
        const errorMessage =
          err?.response?.data?.message ||
          err.message ||
          'Something went wrong!';
        if (
          errorMessage === 'User is not verified. Please verify your account.'
        ) {
          navigation.navigate(Paths.VerifyEmail, {email: form.email});
        }
        Alert.alert('Login Error:', errorMessage);
      },
    });

  const onSignInPress = async () => {
    try {
      console.log('Submitting Form:', form);
      await loginMutation(form);
    } catch (error) {
      // console.log('Signin Failed:', error);
    }
  };

  // const guestLogin = async () => {
  //   try {
  //     await loginMutation({
  //       email: 'bigaja9282@flektel.com',
  //       password: '12345678',
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
                SIGN IN
              </CustomText>
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
                title={loginMutationPending ? 'Signing In...' : 'Sign In'}
                textVariant="primary"
                onPress={onSignInPress}
                isDisabled={!form.email && !form.password}
                isLoading={loginMutationPending}
              />
            </View>

            {/* <View style={styles.buttonSpacing}>
              <CustomButton
                title={loginMutationPending ? 'Signing In...' : 'Guest Login'}
                textVariant="primary"
                onPress={guestLogin}
                isLoading={loginMutationPending}
              />
            </View> */}

            <TouchableOpacity
              onPress={() => navigation.navigate(Paths.Register)}
              style={styles.linkSpacing}>
              <CustomText
                style={styles.linkText}
                variant="h6"
                fontFamily="Montserrat-SemiBold">
                New user?
                <CustomText
                  style={styles.linkTextBold}
                  variant="h6"
                  fontFamily="Montserrat-SemiBold">
                  Sign Up
                </CustomText>
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate(Paths.ForgetPassword)}
              style={styles.linkSpacingForgetPass}>
              <CustomText
                style={styles.linkText}
                variant="h6"
                fontFamily="Montserrat-SemiBold">
                Forget Password
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

export default Login;
