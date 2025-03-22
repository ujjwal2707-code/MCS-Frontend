import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';

const Register = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <View style={styles.logoContainer}>
            <Image
              source={images.logo1}
              style={styles.logo}
              resizeMode="contain"
            />
          </View> */}

      <Text style={styles.welcomeText}>Welcome</Text>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Enter First Name"
          value={form.firstName}
          onChangeText={value => setForm({...form, firstName: value})}
        />
        <TextInput
          placeholder="Enter Last Name"
          value={form.lastName}
          onChangeText={value => setForm({...form, lastName: value})}
        />
        <TextInput
          placeholder="Enter email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={value => setForm({...form, email: value})}
        />
        <TextInput
          placeholder="Enter password"
          secureTextEntry={true}
          value={form.password}
          onChangeText={value => setForm({...form, password: value})}
        />

        <View style={styles.buttonSpacing}>
          <Button
            title="Sign Up"
            // onPress={onSignInPress}
            disabled={!form.email && !form.password}
          />
        </View>

        <View style={styles.buttonSpacing}>
          <Button
            title="Guest login"
            // onPress={guestLogin}
            // disabled={loginMutationPending}
          />
        </View>

        <TouchableOpacity
          //   onPress={() => navigation.navigate("SignIn")}
          style={styles.linkSpacing}>
          <Text style={styles.linkText}>
            Don't have an account?{' '}
            <Text style={styles.linkTextBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          //   onPress={() => navigation.navigate("ForgetPassword")}
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
    backgroundColor: '#0061FF',
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
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
    color: '#FFFFFF',
  },
  linkTextBold: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  forgetPassword: {
    fontSize: 18,
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 8,
  },
});

export default Register;
