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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Create your account</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter First Name"
          value={form.firstName}
          onChangeText={value => setForm({...form, firstName: value})}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Last Name"
          value={form.lastName}
          onChangeText={value => setForm({...form, lastName: value})}
        />
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
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={form.password}
          onChangeText={value => setForm({...form, password: value})}
        />

        <View style={styles.buttonSpacing}>
          <Button
            title={registerMutationPending ? 'Signing Up...' : 'Sign Up'}
            onPress={onSignUpPress}
            disabled={!form.email || !form.password || registerMutationPending}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate(Paths.Login)}
          style={styles.linkSpacing}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.linkTextBold}>Sign In</Text>
          </Text>
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

export default Register;
