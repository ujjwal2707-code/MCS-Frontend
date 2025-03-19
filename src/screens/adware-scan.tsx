import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Image} from 'react-native';
import {NativeModules} from 'react-native';

const {AdsServices} = NativeModules;

type AppInfo = {
  packageName: string;
  name: string;
  icon: string;
  permissions: string[];
};

type AdsServiceInfo = {
  packageName: string;
  serviceName: string;
};

type AppWithAds = {
  packageName: string;
  name: string;
  icon: string;
  ads: string[];
};

const AdwareScan = () => {
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [adsServices, setAdsServices] = useState<AdsServiceInfo[]>([]);
  const [appsWithAds, setAppsWithAds] = useState<AppWithAds[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AdsServices.getInstalledApps()
      .then((result: AppInfo[]) => {
        setApps(result);
      })
      .catch((err: any) => {
        console.error('Error fetching installed apps:', err);
        setError('Error fetching installed apps');
      });

    AdsServices.getAdsServices()
      .then((result: AdsServiceInfo[]) => {
        setAdsServices(result);
      })
      .catch((err: any) => {
        console.error('Error fetching ads services:', err);
        setError('Error fetching ads services');
      });
  }, []);

  // Combine the data by grouping ads services by packageName.
  useEffect(() => {
    if (apps.length && adsServices.length) {
      const groupedAds = adsServices.reduce(
        (acc: {[key: string]: string[]}, service) => {
          if (!acc[service.packageName]) {
            acc[service.packageName] = [];
          }
          acc[service.packageName].push(service.serviceName);
          return acc;
        },
        {} as {[key: string]: string[]},
      );

      // Create a list of apps that have ads services.
      const combined: AppWithAds[] = apps
        .filter(app => groupedAds[app.packageName])
        .map(app => ({
          packageName: app.packageName,
          name: app.name,
          icon: app.icon,
          ads: groupedAds[app.packageName],
        }));

      setAppsWithAds(combined);
    }
  }, [apps, adsServices]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Apps and their Ads Services</Text>
      {appsWithAds.map((item, index) => (
        <View key={index} style={styles.appContainer}>
          {item.icon ? (
            <Image
              source={{uri: `data:image/png;base64,${item.icon}`}}
              style={styles.icon}
            />
          ) : (
            <View style={styles.noIcon}>
              <Text>No Icon</Text>
            </View>
          )}
          <View style={styles.appDetails}>
            <Text style={styles.appName}>{item.name}</Text>
            <Text style={styles.packageName}>{item.packageName}</Text>
            <Text style={styles.adsHeader}>Ads Services:</Text>
            <Text style={styles.adsList}>{item.ads.join(', ')}</Text>
          </View>
        </View>
      ))}
      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
};

export default AdwareScan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingVertical: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  appContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  icon: {
    width: 64,
    height: 64,
    marginRight: 12,
  },
  noIcon: {
    width: 64,
    height: 64,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  appDetails: {
    flex: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
  },
  packageName: {
    fontSize: 12,
    color: '#666',
  },
  adsHeader: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  adsList: {
    fontSize: 16,
    color: '#333',
    marginBottom:2
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
});

