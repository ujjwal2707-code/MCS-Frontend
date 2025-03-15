import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {RootStackParamList} from '../navigation/types';
import {Paths} from '../navigation/paths';

interface FeatureTileType {
  id: string;
  icon?: React.ReactNode;
  label: string;
  route: keyof RootStackParamList;
}
export const featureTiles: FeatureTileType[] = [
  {
    id: '1',
    // icon: <MaterialCommunityIcons name="web-check" size={24} color="black" />,
    label: 'Scan QR Code',
    route: Paths.ScanQr,
  },
  {
    id: '2',
    //   icon: <FontAwesome5 name="globe" size={24} color="black" />,
    label: 'Scan URL',
    route: Paths.ScanUrl,
  },
  {
    id: '3',
    //   icon: <FontAwesome5 name="wifi" size={24} color="black" />,
    label: 'Wifi Security',
    route: Paths.WifiSecurity,
  },
  {
    id: '4',
    //   icon: (
    //     <MaterialCommunityIcons
    //       name="application-settings"
    //       size={24}
    //       color="black"
    //     />
    //   ),
    label: 'App Permissions',
    route: Paths.AppPermission,
  },
  {
    id: '5',
    //   icon: (
    //     <MaterialCommunityIcons name="shield-check" size={24} color="black" />
    //   ),
    label: 'Security Advisor',
    route: Paths.SecurityAdvisor,
  },
];
