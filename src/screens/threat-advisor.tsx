import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {NativeModules} from 'react-native';
import FullScreenLoader from '../components/full-screen-loader';

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
  const [showRisky, setShowRisky] = useState(false);
  const [showNonRisky, setShowNonRisky] = useState(false);

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
      <Text style={styles.appName}>{app.name}</Text>
    </View>
  );

  if (loading) {
    return (
      <FullScreenLoader />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setShowRisky(!showRisky)}>
        <Text style={styles.accordionHeaderText}>
          Risky Apps ({riskyApps.length})
        </Text>
      </TouchableOpacity>
      {showRisky && (
        <View style={styles.accordionContent}>
          {riskyApps.length > 0 ? (
            riskyApps.map(renderAppItem)
          ) : (
            <Text style={styles.noAppsText}>No Risky Apps found.</Text>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setShowNonRisky(!showNonRisky)}>
        <Text style={styles.accordionHeaderText}>
          Non-Risky Apps ({nonRiskyApps.length})
        </Text>
      </TouchableOpacity>
      {showNonRisky && (
        <View style={styles.accordionContent}>
          {nonRiskyApps.length > 0 ? (
            nonRiskyApps.map(renderAppItem)
          ) : (
            <Text style={styles.noAppsText}>No Non-Risky Apps found.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom:40
  },
  accordionHeader: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
  accordionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
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
  appName: {
    fontSize: 16,
  },
  noAppsText: {
    fontStyle: 'italic',
    color: '#555',
  },
});

export default ThreatAdvisor;
