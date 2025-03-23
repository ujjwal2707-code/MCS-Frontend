import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {Paths} from '../../navigation/paths';
import {useMutation} from '@tanstack/react-query';
import {apiService} from '../../services';
import {useAuth} from '../../context/auth-context';
import {CommonActions} from '@react-navigation/native';

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
        console.log(err, 'errrrrrrrr');
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
      console.log('Signin Failed:', error);
    }
  };

  const guestLogin = async () => {
    try {
      await loginMutation({
        email: 'yepoba5531@oziere.com',
        password: '12345678',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={value => setForm({...form, email: value})}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry={true}
          value={form.password}
          onChangeText={value => setForm({...form, password: value})}
        />

        <View style={styles.buttonSpacing}>
          <Button
            title="Sign In"
            onPress={onSignInPress}
            disabled={!form.email && !form.password}
          />
        </View>

        <View style={styles.buttonSpacing}>
          <Button
            title="Guest login"
            onPress={guestLogin}
            disabled={loginMutationPending}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate(Paths.Register)}
          style={styles.linkSpacing}>
          <Text style={styles.linkText}>
            Don't have an account?{' '}
            <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate(Paths.ForgetPassword)}
          style={styles.linkSpacing}>
          <Text style={styles.forgetPassword}>Forget Password?</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // backgroundColor: '#0061FF',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    // color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor:'gray',
    borderRadius:20
  },
  formContainer: {
    padding: 12,
  },
  buttonSpacing: {
    marginTop: 24,
  },
  linkSpacing: {
    marginTop: 40,
  },
  linkText: {
    fontSize: 18,
    textAlign: 'center',
    // color: '#FFFFFF',
  },
  linkTextBold: {
    fontSize: 18,
    textAlign: 'center',
    // color: '#FFFFFF',
    fontWeight: 'bold',
  },
  forgetPassword: {
    fontSize: 18,
    textAlign: 'center',
    // color: '#FFFFFF',
    marginTop: 8,
  },
});

export default Login;
