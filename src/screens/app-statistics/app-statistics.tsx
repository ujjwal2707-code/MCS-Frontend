import {
  View,
  Text,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {NativeModules} from 'react-native';
import {FeatureTileType, InstalledAppStats} from '../../../types/types';
import {Paths} from '../../navigation/paths';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootScreenProps} from '../../navigation/types';

const {InstalledAppsStatistics} = NativeModules;

const AppStatistics = ({navigation}: RootScreenProps<Paths.AppStatistics>) => {
  const [apps, setApps] = useState<InstalledAppStats[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );

  const [openAlertModel, setOpenAlertModel] = useState(false);

  const handleOpenAlertModel = () => {
    setOpenAlertModel(true);
  };

  const handleCloseAlertModel = () => {
    setOpenAlertModel(false);
  };

  console.log('====================================');
  console.log(permissionGranted,apps);
  console.log('====================================');

  useEffect(() => {
    const checkPermissionAndLoadApps = async () => {
      try {
        // Check if usage stats permission is granted
        const hasPermission: boolean =
          await InstalledAppsStatistics.checkUsageStatsPermission();
        setPermissionGranted(hasPermission);

        // If permission is missing, navigate user to usage setting
        if (!hasPermission) {
          handleOpenAlertModel();
          return;
        }

        // If permission is granted, load your apps data
        const appsData: InstalledAppStats[] =
          await InstalledAppsStatistics.getInstalledApps();
        setApps(appsData);
      } catch (error) {
        console.error('Error loading apps:', error);
      }
    };

    checkPermissionAndLoadApps();
  }, []);

  const handleOpenSetting = async() =>{
    try {
      handleCloseAlertModel()
      await InstalledAppsStatistics.openUsageAccessSettings();
    } catch (error) {
      console.log(error);  
    }
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
          paddingVertical: 5,
        }}>

        <FlatList
          data={featureTiles}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={{paddingHorizontal: 10, paddingTop: 10}}
          columnWrapperStyle={{justifyContent: 'space-evenly'}}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.container}
              disabled={!permissionGranted}
              onPress={() => navigation.navigate(item.route, {apps: apps})}>
              {item.icon}
              <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          scrollEnabled={false}
        />
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openAlertModel}
        onRequestClose={handleCloseAlertModel}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={{fontSize:18,fontWeight:400}}>
              Usage stats permission not granted. Please enable it in settings.
            </Text>
            <View style={{padding:2,marginTop:4}}>
            <Button title="Go to setting" onPress={handleOpenSetting} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AppStatistics;

const featureTiles: FeatureTileType[] = [
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
];

const styles = StyleSheet.create({
  container: {
    width: '40%',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // optional: darken background
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
});
