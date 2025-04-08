import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import Loader from '@components/loader';
import ScreenHeader from '@components/screen-header';
import ScreenLayout from '@components/screen-layout';
import CustomText from '@components/ui/custom-text';
import {Paths} from '@navigation/paths';
import {RootScreenProps} from '@navigation/types';
import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {NativeModules} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {InstalledApp, InstalledAppAdsInfo} from 'types/types';

const {AdsServices} = NativeModules;

const AdwareScan = ({navigation}: RootScreenProps<Paths.AdwareScan>) => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [adsServices, setAdsServices] = useState<InstalledAppAdsInfo[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const installedApps = await AdsServices.getInstalledApps();
        setApps(installedApps);
        const adsServives = await AdsServices.getAdsServices();
        setAdsServices(adsServives);
      } catch (error) {
        console.error('Error fetching apps:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Compute grouped ads services for easier lookup
  const groupedAds = useMemo(() => {
    return adsServices.reduce(
      (acc: { [key: string]: string[] }, service) => {
        if (!acc[service.packageName]) {
          acc[service.packageName] = [];
        }
        acc[service.packageName].push(service.serviceName);
        return acc;
      },
      {} as { [key: string]: string[] },
    );
  }, [adsServices]);

  // Filter apps that have at least one ads service
  const filteredApps = useMemo(() => {
    return apps.filter(
      (app) => groupedAds[app.packageName] && groupedAds[app.packageName].length > 0,
    );
  }, [apps, groupedAds]);

  const handleAppPress = (selectedApp: InstalledApp) => {
    const appAds = groupedAds[selectedApp.packageName] || [];
    navigation.navigate(Paths.AdsList, {
      app: selectedApp,
      ads: appAds,
    });
  };

  return (
    <ScreenLayout>
      <ScreenHeader name="Adware Scan" />

      {loading ? (
        <Loader />
      ) : (
        <FlatList
          data={filteredApps}
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
            Intrusive ads and pop-ups often signal malware infections. Detecting
            and eliminating adware-infected applications reduces unwanted
            advertisements and prevents potential data theft.
          </CustomText>
        </AlertBox>
      </View>
      <BackBtn />
    </ScreenLayout>
  );
};

export default AdwareScan;

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
    marginTop: 20,
    marginBottom: 10,
  },
});
