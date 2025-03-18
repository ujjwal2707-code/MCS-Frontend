import {FlatList, ScrollView} from 'react-native';
import React from 'react';
import {Paths} from '../navigation/paths';
import {NoParamsRoutes, RootScreenProps, RootStackParamList} from '../navigation/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatureTile from '../components/feauture-tile';
import { FeatureTileType } from '../../types/types';

// type NoParamsRoutes = {
//   [K in keyof RootStackParamList]: RootStackParamList[K] extends undefined
//     ? K
//     : never;
// }[keyof RootStackParamList];

const Home = ({navigation}: RootScreenProps<Paths.Home>) => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}>
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
