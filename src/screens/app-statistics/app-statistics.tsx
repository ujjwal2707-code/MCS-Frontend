import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  AppState,
} from 'react-native';
import {NativeModules} from 'react-native';
import {Paths} from '../../navigation/paths';
import {RootScreenProps} from '../../navigation/types';
import {FeatureTileType} from '../../../types/types';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import {featureTilesData} from '@constants/app-stats';
import FeatureTile from '@components/feauture-tile';
import CustomText from '@components/ui/custom-text';
import CustomButton from '@components/ui/custom-button';

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
      <FeatureTile
        icon={item.icon}
        image={item.image!}
        label={item.label}
        onPress={() => {
          handlePress(item.route);
        }}
      />
    ),
    [permissionGranted, handlePress],
  );

  return (
    <>
      <ScreenLayout>
        <ScreenHeader name="App Statistics" />

        <FlatList
          data={featureTilesData}
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
              <CustomText
                style={styles.modalText}
                fontFamily="Montserrat-SemiBold"
                color="#fff">
                Usage stats permission not granted. Please enable it in
                settings.
              </CustomText>
              <View style={styles.modalButtonContainer}>
                <CustomButton
                  title="Go to settings"
                  onPress={handleOpenSetting}
                />
              </View>
            </View>
          </View>
        </Modal>
      </ScreenLayout>
    </>
  );
};

export default AppStatistics;

const styles = StyleSheet.create({
  flatListContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
    flexGrow: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#2337A8',
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
