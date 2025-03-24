import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
  AppState
} from 'react-native';
import {NativeModules} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Paths} from '../../navigation/paths';
import {RootScreenProps} from '../../navigation/types';
import {FeatureTileType} from '../../../types/types';

const {InstalledAppsStatistics} = NativeModules;

type AllowedRoutes =
  | Paths.AppUsageStats
  | Paths.DataUsageStats
  | Paths.AppUpdates;

const AppStatistics = ({navigation}: RootScreenProps<Paths.AppStatistics>) => {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );
  const [openAlertModel, setOpenAlertModel] = useState(false);

  const checkPermission = useCallback(async () => {
    try {
      const hasPermission: boolean =
        await InstalledAppsStatistics.checkUsageStatsPermission();
      setPermissionGranted(hasPermission);

      if (!hasPermission) {
        setOpenAlertModel(true);
        return;
      }
    } catch (error) {
      console.error('Error loading apps:', error);
    }
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (nextAppState === 'active') {
          checkPermission();
        }
      },
    );

    return () => subscription.remove();
  }, [checkPermission]);

  const handleOpenSetting = useCallback(async () => {
    try {
      setOpenAlertModel(false);
      await InstalledAppsStatistics.openUsageAccessSettings();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handlePress = useCallback(
    (route: AllowedRoutes) => {
      navigation.navigate(route);
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({item}: {item: FeatureTileType & {route: AllowedRoutes}}) => (
      <TouchableOpacity
        style={styles.container}
        disabled={!permissionGranted}
        onPress={() => handlePress(item.route)}>
        {item.icon}
        <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
          {item.label}
        </Text>
      </TouchableOpacity>
    ),
    [permissionGranted, handlePress],
  );

  return (
    <>
      <FlatList
        data={featureTiles}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.flatListContentContainer}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        renderItem={renderItem}
      />

      <Modal
        animationType="slide"
        transparent
        visible={openAlertModel}
        onRequestClose={() => setOpenAlertModel(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Usage stats permission not granted. Please enable it in settings.
            </Text>
            <View style={styles.modalButtonContainer}>
              <Button title="Go to setting" onPress={handleOpenSetting} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AppStatistics;

const featureTiles: (FeatureTileType & {route: AllowedRoutes})[] = [
  {
    id: '1',
    icon: <MaterialCommunityIcons name="web-check" size={24} color="black" />,
    label: 'Active Time Stats',
    route: Paths.AppUsageStats,
  },
  {
    id: '2',
    icon: <Ionicons name="globe-outline" size={24} color="black" />,
    label: 'Data Usage Stats',
    route: Paths.DataUsageStats,
  },
  {
    id: '3',
    icon: <Ionicons name="globe-outline" size={24} color="black" />,
    label: 'App Updates',
    route: Paths.AppUpdates,
  },
];

const styles = StyleSheet.create({
  flatListContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
    flexGrow: 1,
  },
  container: {
    width: '30%',
    height: 112,
    margin: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#374151',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Rubik',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  modalButtonContainer: {
    padding: 2,
    marginTop: 4,
  },
});
