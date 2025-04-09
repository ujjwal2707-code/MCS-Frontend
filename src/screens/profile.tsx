import {View, Text, Button, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {apiService} from '../services';
import {useAuth} from '../context/auth-context';
import {Paths} from '../navigation/paths';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '@navigation/bottom-tab-params';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import {Avatar, Card, Divider} from 'react-native-paper';
import CustomText from '@components/ui/custom-text';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BackBtn from '@components/back-btn';
import Loader from '@components/loader';

type ProfileProps = BottomTabScreenProps<BottomTabParamList, Paths.Profile>;

function getInitials(name: string): string {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial =
    parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : '';

  return firstInitial + lastInitial;
}


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
  };

  const settings = [
    {
      title: 'Manage Accounts',
      icon: <Ionicons name="chevron-forward-sharp" size={30} color="white" />,
      onPress: () => {
        navigation.getParent()?.navigate(Paths.ManageAccounts);
      },
    },
    // {
    //   title: 'Settings',
    //   icon: <Ionicons name="chevron-forward-sharp" size={30} color="white" />,
    //   onPress: () => {},
    // },
    {
      title: 'Privacy Policy',
      icon: <Ionicons name="chevron-forward-sharp" size={30} color="white" />,
      onPress: () => {
        navigation.getParent()?.navigate(Paths.PrivacyPolicy);
      },
    },
    // {
    //   title: 'Update Password',
    //   icon: <Ionicons name="chevron-forward-sharp" size={30} color="white" />,
    //   onPress: () => {},
    // },
    {
      title: 'Logout',
      icon: <MaterialCommunityIcons name="logout" size={30} color="white" />,
      onPress: handleLogout,
    },
  ];

  const profileLabel = getInitials(user?.name);

  return (
    <ScreenLayout>
      <ScreenHeader />
      {isLoading ? (
        <Loader />
      ) : (
        <View style={styles.bioContainer}>
          <Avatar.Text size={64} label={profileLabel} />
          <View>
            <CustomText color="#FFF" variant="h4" fontFamily="Montserrat-Bold">
              {user?.name}
            </CustomText>
            <CustomText
              color="#FFF"
              variant="h6"
              fontFamily="Montserrat-Medium">
              Member Since{' '}
              {user?.createdAt
                ? (() => {
                    const date = new Date(user.createdAt);
                    const month = date.toLocaleString('en-US', {
                      month: 'short',
                    });
                    const year = date.toLocaleString('en-US', {
                      year: 'numeric',
                    });
                    return `${month}, ${year}`;
                  })()
                : ''}
            </CustomText>
          </View>
        </View>
      )}
      <Card style={styles.card}>
        <Card.Content>
          {settings.map((item, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity onPress={item.onPress}>
                <View style={styles.cardItemContainer}>
                  <CustomText
                    color="#FFF"
                    variant="h5"
                    fontFamily="Montserrat-Regular">
                    {item.title}
                  </CustomText>
                  {item.icon}
                </View>
              </TouchableOpacity>
              {index < settings.length - 1 && (
                <Divider style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </Card.Content>
      </Card>

      <BackBtn />
    </ScreenLayout>
  );
};

export default Profile;

const styles = StyleSheet.create({
  bioContainer: {
    paddingVertical: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    borderRadius: 20,
    backgroundColor: '#2337A8', // #2337A8 // #4E4E96 // #2337A8
    marginTop: 10,
    padding: 0,
  },
  cardItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
    marginHorizontal: 0,
  },
});
