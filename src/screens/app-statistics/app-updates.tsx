import Loader from '@components/loader';
import ScreenHeader from '@components/screen-header';
import ScreenLayout from '@components/screen-layout';
import CustomText from '@components/ui/custom-text';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {NativeModules} from 'react-native';
import {InstalledAppStats} from 'types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootScreenProps} from '@navigation/types';
import {Paths} from '@navigation/paths';
import BackBtn from '@components/back-btn';

const {InstalledAppsStatistics} = NativeModules;

const AppUpdates = ({navigation}: RootScreenProps<Paths.AppUpdates>) => {
  const [apps, setApps] = useState<InstalledAppStats[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const appsData: InstalledAppStats[] =
          await InstalledAppsStatistics.getInstalledApps();
        setApps(appsData);
      } catch (error) {
        console.error('Error scanning WiFi networks:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAppPress = (selectedApp: InstalledAppStats) => {
    navigation.navigate(Paths.AppUpdatesDetails, {app: selectedApp});
  };

  return (
    <ScreenLayout>
      <ScreenHeader name="App Updates" />

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
                  <CustomText
                    variant="h6"
                    fontFamily="Montserrat-Medium"
                    color="#fff">
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
       <BackBtn />
    </ScreenLayout>
  );
};

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
    width: 40,
    height: 40,
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
    marginTop: 10,
  },
});

export default AppUpdates;
