import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import {NativeModules} from 'react-native';
import FullScreenLoader from '../components/full-screen-loader';
import CustomText from '@components/ui/custom-text';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import Loader from '@components/loader';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface InstalledApp {
  packageName: string;
  name: string;
  permissions: string[];
  sha256: string;
  isRisky: boolean;
  icon: string;
}

interface InstalledAppsModule {
  getInstalledApps: (includeIcons: boolean) => Promise<InstalledApp[]>;
}

const {InstalledAppsThreatAnalysis} = NativeModules as {
  InstalledAppsThreatAnalysis: InstalledAppsModule;
};

const ThreatAdvisor = () => {
  const [apps, setApps] = useState<InstalledApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'risky' | 'nonRisky'>('risky');

  useEffect(() => {
    const init = async () => {
      try {
        const installedApps =
          await InstalledAppsThreatAnalysis.getInstalledApps(true);
        setApps(installedApps);
      } catch (err) {
        console.error('Error fetching apps:', err);
        setError('Error fetching apps');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const riskyApps = apps.filter(app => app.isRisky);
  const nonRiskyApps = apps.filter(app => !app.isRisky);

  const renderAppItem = (app: InstalledApp) => (
    <View key={app.packageName} style={styles.appItem}>
      {app.icon ? (
        <Image
          source={{uri: `data:image/webp;base64,${app.icon}`}}
          style={styles.appIcon}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.appIcon, styles.noIcon]} />
      )}
      <CustomText color="#fff">{app.name}</CustomText>
    </View>
  );
  return (
    <ScreenLayout>
      <ScreenHeader name="Threat Analyzer" />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'risky' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('risky')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'risky' && styles.activeTabText,
            ]}>
            Risky Apps ({riskyApps.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'nonRisky' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('nonRisky')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'nonRisky' && styles.activeTabText,
            ]}>
            Non-Risky Apps ({nonRiskyApps.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedTab === 'risky' && (
          <View style={styles.tabContent}>
            {riskyApps.length > 0 ? (
              riskyApps.map(renderAppItem)
            ) : (
              <CustomText
                color="#fff"
                variant="h5"
                fontFamily="Montserrat-SemiBold">
                No Risky Apps found.
              </CustomText>
            )}
          </View>
        )}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {selectedTab === 'nonRisky' && (
          <View style={styles.tabContent}>
            {nonRiskyApps.length > 0 ? (
              nonRiskyApps.map(renderAppItem)
            ) : (
              <CustomText
                color="#fff"
                variant="h5"
                fontFamily="Montserrat-SemiBold">
                No Non-Risky Apps found.
              </CustomText>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    marginTop: 20,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#4E4E96',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#2337A8',
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Monospace',
  },
  activeTabText: {
    color: '#fff',
  },
  tabContent: {
    backgroundColor: '#2337A8',
    borderRadius: 10,
    padding: 12,
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  appIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  noIcon: {
    backgroundColor: '#ccc',
  },
  scrollContainer: {
    paddingBottom: 10,
  },
});

export default ThreatAdvisor;
