import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomButton from '@components/ui/custom-button';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CustomText from '@components/ui/custom-text';
import {useMutation, useQuery} from '@tanstack/react-query';
import {apiService} from '@services/index';
import {useAuth} from '@context/auth-context';
import InputField from '@components/ui/input-field';

const MangeAccounts = () => {
  const [openUpdatePass, setOpenUpdatePass] = useState(false);

  const {token} = useAuth();

  const {data: user} = useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      if (!token) throw new Error('Token is missing');

      const response = await apiService.getUserProfile(token);
      if (!response) {
        throw new Error('API call failed: No response received.');
      }
      if (response.status !== 200) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`,
        );
      }
      if (!response.data || !response.data.success) {
        throw new Error('Invalid API response format.');
      }

      return response.data.data;
    },
    staleTime: 0,
    retry: false, // Prevent retrying if token is missing
  });

  return (
    <ScreenLayout>
      <ScreenHeader name="Manage Accounts" />

      <View style={{paddingVertical: 20, paddingHorizontal: 20}}>
        <CustomButton
          title="Update Password"
          onPress={() => setOpenUpdatePass(true)}
        />
      </View>

      <UpdatePassword
        isOpen={openUpdatePass}
        onClose={() => setOpenUpdatePass(false)}
        userEmail={user?.email}
      />
    </ScreenLayout>
  );
};

export default MangeAccounts;

interface WifiDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

const UpdatePassword = ({isOpen, onClose, userEmail}: WifiDetailsProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const {logout} = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const {
    mutateAsync: changePasswordMutation,
    isPending: changePasswordMutationPending,
  } = useMutation({
    mutationFn: (values: {
      email: string;
      oldPassword: string;
      newPassword: string;
    }) => apiService.changePassword(values),
    onSuccess: res => {
      Alert.alert('Success', res?.data?.message);
      handleLogout()
    },
    onError: (err: any) => {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Something went wrong!',
      );
    },
  });

  const handleChangePassword = async () => {
    try {
      await changePasswordMutation({
        email: userEmail,
        oldPassword,
        newPassword,
      });
    } catch (error) {
      console.log('forgetPasswordMutation error', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['45%', '90%']}
      index={1}
      enablePanDownToClose={true} // Allows swipe down to close
      onClose={onClose}
      backgroundStyle={{backgroundColor: '#4E4E96'}}>
      <BottomSheetScrollView style={{flex: 1}}>
        <CustomText
          variant="h5"
          color="#fff"
          fontFamily="Montserrat-Bold"
          style={{textAlign: 'center', marginTop: 10}}>
          Update Password
        </CustomText>

        <View style={{paddingVertical: 20, paddingHorizontal: 20}}>
          <InputField
            placeholder="Enter Old Password"
            secureTextEntry={true}
            textContentType="password"
            onChangeText={value => setOldPassword(value)}
          />

          <InputField
            placeholder="Enter New Password"
            secureTextEntry={true}
            textContentType="password"
            onChangeText={value => setNewPassword(value)}
          />

          <CustomButton
            title="Update"
            style={{width: '50%', alignSelf: 'center', marginTop: 10}}
            onPress={handleChangePassword}
            isLoading={changePasswordMutationPending}
            isDisabled={!oldPassword && !newPassword}
          />
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({});
