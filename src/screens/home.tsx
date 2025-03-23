import {FlatList, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Paths} from '../navigation/paths';
import {RootScreenProps} from '../navigation/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatureTile from '../components/feauture-tile';
import {FeatureTileType} from '../../types/types';
import {useAuth} from '../context/auth-context';
import {apiService} from '../services';
import {useQuery} from '@tanstack/react-query';

const Home = ({navigation}: RootScreenProps<Paths.Home>) => {
  const {token} = useAuth();

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
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}>
      <TouchableOpacity
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingBottom: 5,
          paddingTop: 5,
        }}
        onPress={() => {
          navigation.navigate(Paths.Profile);
        }}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>
          Welcome, {user?.name}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={featureTiles}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={({item}) => (
          <FeatureTile
            icon={item.icon}
            label={item.label}
            onPress={() => {
              console.log('Navigating to:', item.route);
              navigation.navigate(item.route);
            }}
          />
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

export default Home;

const featureTiles: FeatureTileType[] = [
  {
    id: '1',
    icon: <MaterialCommunityIcons name="web-check" size={24} color="black" />,
    label: 'Scan QR Code',
    route: Paths.ScanQr,
  },
  {
    id: '2',
    icon: <Ionicons name="globe-outline" size={24} color="black" />,
    label: 'Scan URL',
    route: Paths.ScanUrl,
  },
  {
    id: '3',
    icon: <MaterialCommunityIcons name="wifi" size={24} color="black" />,
    label: 'Wifi Security',
    route: Paths.WifiSecurity,
  },
  {
    id: '8',
    icon: <MaterialCommunityIcons name="wifi" size={24} color="black" />,
    label: 'Cyber News',
    route: Paths.CyberNews,
  },
  {
    id: '9',
    icon: <MaterialCommunityIcons name="wifi" size={24} color="black" />,
    label: 'OTP Security',
    route: Paths.OtpSecurity,
  },
  {
    id: '10',
    icon: <MaterialCommunityIcons name="wifi" size={24} color="black" />,
    label: 'Data Breach',
    route: Paths.DataBreach,
  },
  {
    id: '4',
    icon: (
      <MaterialCommunityIcons
        name="application-settings"
        size={24}
        color="black"
      />
    ),
    label: 'App Permissions',
    route: Paths.AppPermission,
  },
  {
    id: '5',
    icon: (
      <MaterialCommunityIcons name="shield-check" size={24} color="black" />
    ),
    label: 'Security Advisor',
    route: Paths.SecurityAdvisor,
  },
  {
    id: '6',
    icon: (
      <MaterialCommunityIcons name="shield-alert" size={24} color="black" />
    ),
    label: 'Threat Analyzer',
    route: Paths.ThreatAdvisor,
  },
  {
    id: '7',
    icon: (
      <MaterialCommunityIcons name="shield-check" size={24} color="black" />
    ),
    label: 'Adware Scan',
    route: Paths.AdwareScan,
  },
  {
    id: '11',
    icon: <MaterialCommunityIcons name="wifi" size={24} color="black" />,
    label: 'App Statistics',
    route: Paths.AppStatistics,
  },
  {
    id: '12',
    icon: <MaterialCommunityIcons name="wifi" size={24} color="black" />,
    label: 'Hidden Application',
    route: Paths.HiddenApps,
  },
];
