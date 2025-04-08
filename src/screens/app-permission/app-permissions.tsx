import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {NativeModules, Platform} from 'react-native';
import FullScreenLoader from '../../components/full-screen-loader';
import {InstalledApp} from '../../../types/types';
import {RootScreenProps} from '../../navigation/types';
import {Paths} from '../../navigation/paths';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import Loader from '@components/loader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';

interface InstalledAppsModule {
  getInstalledApps: () => Promise<InstalledApp[]>;
}

const {InstalledApps} = NativeModules as {InstalledApps: InstalledAppsModule};

const AppPermissions = ({navigation}: RootScreenProps<Paths.AppPermission>) => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(false);
  // console.log(apps);

  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === 'android') {
        try {
          setLoading(true);
          const installedApps = await InstalledApps.getInstalledApps();
          setApps(installedApps);
        } catch (error) {
          console.error('Error fetching apps:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('Listing installed apps is not supported on iOS.');
      }
    };
    init();
  }, []);

  const handleAppPress = (selectedApp: InstalledApp) => {
    navigation.navigate(Paths.AppPermissionDetails, {app: selectedApp});
  };

  return (
    <ScreenLayout style={{flex: 1}}>
      <View style={{paddingBottom: 20}}>
        <ScreenHeader name="App Permissions" />
      </View>

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={apps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleAppPress(item)}>
              <View style={styles.appContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {item.icon ? (
                    <Image
                      source={{uri: `data:image/png;base64,${item.icon}`}}
                      style={styles.appIcon}
                    />
                  ) : (
                    <Text style={styles.noIcon}>No Icon</Text>
                  )}
                  <CustomText fontFamily="Montserrat-Medium" color="#fff">
                    {item.name}
                  </CustomText>
                </View>
                <View>
                  <Ionicons
                    name="chevron-forward-sharp"
                    size={30}
                    color="#707070"
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          contentContainerStyle={styles.listContentContainer}
        />
      )}

      <View>
        <AlertBox isOpen={modalVisible} onClose={closeModal}>
          <CustomText
            fontFamily="Montserrat-Medium"
            style={{
              color: '#FFFFFF',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 20,
            }}>
            Many apps request unnecessary access to personal data, creating
            security risks. Reviewing and highlighting risky permissions makes
            it easier to revoke access and safeguard privacy.
          </CustomText>
        </AlertBox>
      </View>
      <BackBtn />
    </ScreenLayout>
  );
};

export default AppPermissions;

const styles = StyleSheet.create({
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
  },
  appIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  noIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
    textAlign: 'center',
    lineHeight: 50,
  },
  listContentContainer: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#2337A8',
  },
});
