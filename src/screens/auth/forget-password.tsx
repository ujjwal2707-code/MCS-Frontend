import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Forget Password</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          textContentType="emailAddress"
          value={email}
          onChangeText={value => setEmail(value)}
        />

        <View style={styles.buttonSpacing}>
          <Button
            title="Sign In"
            // onPress={onSignInPress}
            disabled={!email}
          />
        </View>

        <View style={styles.buttonSpacing}>
          <Button
            title="Guest login"
            // onPress={guestLogin}
            // disabled={loginMutationPending}
          />
        </View>

        <Button
          title="Back to Signin"
          // onPress={}
          disabled={!email}
        />
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

export default ForgetPassword;
