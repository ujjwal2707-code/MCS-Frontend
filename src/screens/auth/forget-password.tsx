import {
  View,
  Text,
  Button,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import { RootScreenProps } from '@navigation/types';
import { Paths } from '@navigation/paths';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '@services/index';

const ForgetPassword = ({navigation}: RootScreenProps<Paths.Login>) => {
  const [email, setEmail] = useState('');

  const {
    mutateAsync: forgetPasswordMutation,
    isPending: forgetPasswordMutationPending,
  } = useMutation({
    mutationFn: (values: { email: string }) =>
      apiService.forgetPassword(values),
    onSuccess: (res) => {
      Alert.alert("Success", res?.data?.message);
    },
    onError: (err: any) => {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Something went wrong!"
      );
    },
  });

  const handleForgetPassword = async () => {
    try {
      await forgetPasswordMutation({ email });
    } catch (error) {
      console.log("forgetPasswordMutation error", error);
    }
  };
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
            title="Send"
            onPress={handleForgetPassword}
            disabled={!email}
          />
        </View>

        <View style={styles.buttonSpacing}>
        <Button
          title="Back to Signin"
          onPress={() => navigation.navigate(Paths.Login)}
        />
        </View>

        
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

export default ForgetPassword;
