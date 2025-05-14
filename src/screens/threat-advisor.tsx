import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {NativeModules} from 'react-native';
import ScreenLayout from '@components/screen-layout';
import ScreenHeader from '@components/screen-header';
import CustomText from '@components/ui/custom-text';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import {AlertContext} from '@context/alert-context';

interface InstalledApp {
  packageName: string;
  name: string;
  versionName: string;
  versionCode: string;
  icon: string;
  isMalicious: boolean;
  reasons: string[];
  installer: string;
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
  const [selectedTab, setSelectedTab] = useState<'suspicious' | 'safe'>('suspicious');

  // Alert Box
  const {alertSettings, setAlertSetting} = useContext(AlertContext);
  const alertKey = 'threatAdvisor';
  const [modalVisible, setModalVisible] = useState(true);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDontShowAgain = () => {
    setAlertSetting(alertKey, true);
    closeModal();
  };

  useEffect(() => {
    setModalVisible(!alertSettings[alertKey]);
  }, [alertSettings[alertKey]]);

  useEffect(() => {
    const init = async () => {
      try {
        const installedApps = await InstalledAppsThreatAnalysis.getInstalledApps(true);
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

  const suspiciousApps = apps.filter(app => app.isMalicious);
  const safeApps = apps.filter(app => !app.isMalicious);

  const renderAppItem = (app: InstalledApp) => (
    <View key={app.packageName} style={styles.appItem}>
      <View style={styles.appHeader}>
        {app.icon ? (
          <Image
            source={{uri: `data:image/webp;base64,${app.icon}`}}
            style={styles.appIcon}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.appIcon, styles.noIcon]} />
        )}
        <View style={styles.appInfo}>
          <CustomText style={styles.appName} color="#fff">
            {app.name}
          </CustomText>
          <CustomText style={styles.appVersion} color="#ccc">
            Version {app.versionName} ({app.versionCode})
          </CustomText>
        </View>
      </View>
      {app.isMalicious && app.reasons.length > 0 && (
        <View style={styles.reasonsContainer}>
          {app.reasons.map((reason, index) => (
            <CustomText key={index} style={styles.reasonText} color="#ff6b6b">
              • {reason}
            </CustomText>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScreenLayout>
      <ScreenHeader name="Threat Analyzer" />

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'suspicious' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('suspicious')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'suspicious' && styles.activeTabText,
            ]}>
            Suspicious Apps ({suspiciousApps.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'safe' && styles.activeTabButton,
          ]}
          onPress={() => setSelectedTab('safe')}>
          <Text
            style={[
              styles.tabButtonText,
              selectedTab === 'safe' && styles.activeTabText,
            ]}>
            Safe Apps ({safeApps.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.tabContent}>
          {selectedTab === 'suspicious' ? (
            suspiciousApps.length > 0 ? (
              suspiciousApps.map(renderAppItem)
            ) : (
              <CustomText
                color="#fff"
                variant="h5"
                fontFamily="Montserrat-SemiBold">
                No suspicious apps found.
              </CustomText>
            )
          ) : safeApps.length > 0 ? (
            safeApps.map(renderAppItem)
          ) : (
            <CustomText
              color="#fff"
              variant="h5"
              fontFamily="Montserrat-SemiBold">
              No safe apps found.
            </CustomText>
          )}
        </View>
      </ScrollView>

      {modalVisible && (
        <AlertBox
          isOpen={modalVisible}
          onClose={closeModal}
          onDontShowAgain={handleDontShowAgain}>
          <CustomText
            fontFamily="Montserrat-Medium"
            style={styles.alertText}>
            This analyzer checks for potentially malicious apps by detecting signs of tampering,
            unofficial sources, and suspicious modifications. Apps flagged as suspicious may have
            been cracked, modified, or installed from untrusted sources.
          </CustomText>
        </AlertBox>
      )}

      <BackBtn />
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
    marginVertical: 8,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 8,
  },
  noIcon: {
    backgroundColor: '#ccc',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  appVersion: {
    fontSize: 12,
    marginTop: 2,
  },
  reasonsContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  reasonText: {
    fontSize: 14,
    marginVertical: 2,
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ThreatAdvisor;
