import {View, Text, Button} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {apiService} from '../services';
import {useAuth} from '../context/auth-context';
import {RootScreenProps} from '../navigation/types';
import {Paths} from '../navigation/paths';
import {CommonActions} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '@navigation/bottom-tab-params';

type ProfileProps = BottomTabScreenProps<BottomTabParamList, Paths.Profile>;

const Profile: React.FC<ProfileProps> = ({navigation, route}) => {
  const {token, logout} = useAuth();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
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

  const handleLogout = async () => {
    await logout();
    // navigation.dispatch(
    //   CommonActions.reset({
    //     index: 0,
    //     routes: [{name: Paths.Login}],
    //   }),
    // );
  };
  return (
    <View
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        padding: 20,
      }}>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user?.name}</Text>
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user?.email}</Text>
      <View style={{marginTop: 10}}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default Profile;
