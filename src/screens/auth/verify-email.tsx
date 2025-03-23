import {
  View,
  Text,
  ScrollView,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import {RootScreenProps} from '../../navigation/types';
import {useMutation} from '@tanstack/react-query';
import {apiService} from '../../services';
import {Paths} from '../../navigation/paths';

const VerifyEmail: React.FC<RootScreenProps<Paths.VerifyEmail>> = ({
  route,
  navigation,
}) => {
  const {email} = route.params as {email: string};
  const [otp, setOtp] = useState('');

  const {
    mutateAsync: verifyEmailMutation,
    isPending: verifyEmailMutationPending,
  } = useMutation({
    mutationFn: (values: {email: string; tempOtp: string}) =>
      apiService.verifyEmail(values),
    onSuccess: res => {
      console.log('Verification Successful:', res?.data);
      Alert.alert('Success', 'Email verified!');
      navigation.navigate(Paths.Login)
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Verify Email</Text>
      <Text style={styles.welcomeText}>Email : {email}</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter otp"
          value={otp}
          onChangeText={value => setOtp(value)}
        />

        <View style={styles.buttonSpacing}>
          <Button
            title={
              verifyEmailMutationPending ? 'Verifying email...' : 'Verify Email'
            }
            onPress={onPressVerify}
            disabled={otp.length < 6 || verifyEmailMutationPending}
          />
        </View>

        <View style={styles.buttonSpacing}>
          <Button
            title="Resend OTP"
            onPress={onPressResendOTP}
            disabled={!email}
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
});

export default VerifyEmail;
