import {
  View,
  Text,
  NativeModules,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import Loader from '@components/loader';
import CustomText from '@components/ui/custom-text';
import AlertBox from '@components/alert-box';

const {HiddenAppsModule} = NativeModules;

interface AppInfo {
  appName: string;
  packageName: string;
}

const HiddenApps = () => {
  const [hiddenApps, setHiddenApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
  };

  console.log('====================================');
  console.log(hiddenApps);
  console.log('====================================');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const apps = await HiddenAppsModule.getHiddenApps();
        setHiddenApps(apps);
      } catch (error) {
        console.error('Error fetching hidden apps:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <ScreenLayout>
      <ScreenHeader name="Hidden Apps" />

      {loading ? (
        <Loader />
      ) : (
        <>
          {hiddenApps.length === 0 ? (
            <CustomText
              variant="h4"
              fontFamily="Montserrat-ExtraBold"
              style={{textAlign: 'center'}}>
              No hidden apps found.
            </CustomText>
          ) : (
            <FlatList
              data={hiddenApps}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.appContainer}>
                  <View style={{flexDirection: 'column'}}>
                    <CustomText
                      variant="h5"
                      fontFamily="Montserrat-Medium"
                      color="#fff">
                      {item.appName}
                    </CustomText>
                    <CustomText
                      variant="h6"
                      fontFamily="Montserrat-Medium"
                      color="gray">
                      {item.packageName}
                    </CustomText>
                  </View>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
              contentContainerStyle={styles.listContentContainer}
            />
          )}
        </>
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
            Hackers and spyware programs use concealed apps to track users or
            steal data. A deep scan reveals hidden applications, enabling users
            to remove unauthorized or suspicious software.
          </CustomText>
        </AlertBox>
      </View>
    </ScreenLayout>
  );
};

export default HiddenApps;

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
  },
});
