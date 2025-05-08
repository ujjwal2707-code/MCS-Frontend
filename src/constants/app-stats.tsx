import {FeatureTileType} from 'types/types';
import {Paths} from '../navigation/paths';

import activeTimeStats from '@assets/icons/activetimestats.png';
import appUpdate from '@assets/icons/appupdates.png';
import dataUsage from '@assets/icons/datausage.png';

type AllowedRoutes =
  | Paths.AppUsageStats
  | Paths.DataUsageStats
  | Paths.AppUpdates;

export const featureTilesData: (FeatureTileType & {route: AllowedRoutes})[] = [
  {
    id: '1',
    image: activeTimeStats,
    label: 'Active Time Statistics',
    route: Paths.AppUsageStats,
  },
  {
    id: '2',
    image: dataUsage,
    label: 'Network Usage Statistics',
    route: Paths.DataUsageStats,
  },
  {
    id: '3',
    image: appUpdate,
    label: 'App Updates',
    route: Paths.AppUpdates,
  },
];
