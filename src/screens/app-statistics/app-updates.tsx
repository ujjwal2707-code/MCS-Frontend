import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {NativeModules} from 'react-native';
import FullScreenLoader from '../../components/full-screen-loader';

interface AppInfo {
  packageName: string;
  name: string;
  icon: string; // Base64 encoded PNG image string
  lastUpdateTime?: number;
}

interface AppsByUpdate {
  past1Month: AppInfo[];
  past3Month: AppInfo[];
  past6Month: AppInfo[];
}

const {InstalledAppsStatistics} = NativeModules;

// A custom AccordionItem component
const AccordionItem: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Enable layout animation on Android
  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={toggleExpand} style={styles.accordionHeader}>
        <Text style={styles.accordionHeaderText}>{title}</Text>
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const AppUpdates: React.FC = () => {
  const [appsByUpdate, setAppsByUpdate] = useState<AppsByUpdate>({
    past1Month: [],
    past3Month: [],
    past6Month: [],
  });

   const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both update information and installed apps concurrently.
        const [updates, installedApps]: [AppsByUpdate, AppInfo[]] =
          await Promise.all([
            InstalledAppsStatistics.getAppUpdates(),
            InstalledAppsStatistics.getInstalledApps(),
          ]);

        // Build a map from packageName to installed app data (icon, etc.)
        const installedMap: Record<string, AppInfo> = {};
        installedApps.forEach((app: AppInfo) => {
          installedMap[app.packageName] = app;
        });

        // Merge icon info into update data if missing.
        const mergeApps = (updateApps: AppInfo[]): AppInfo[] =>
          updateApps.map(app => {
            if (
              (!app.icon || app.icon === '') &&
              installedMap[app.packageName]
            ) {
              return {...app, icon: installedMap[app.packageName].icon};
            }
            return app;
          });

        const mergedUpdates: AppsByUpdate = {
          past1Month: mergeApps(updates.past1Month),
          past3Month: mergeApps(updates.past3Month),
          past6Month: mergeApps(updates.past6Month),
        };

        setAppsByUpdate(mergedUpdates);
      } catch (error) {
        console.error('Error fetching data:', error);
      }finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render a single app item with its icon and name.
  const renderAppItem = (app: AppInfo) => {
    const imageUri = `data:image/png;base64,${app.icon}`;
    return (
      <View key={app.packageName} style={styles.appItem}>
        {app.icon ? (
          <Image source={{uri: imageUri}} style={styles.icon} />
        ) : null}
        <Text style={styles.appName}>{app.name}</Text>
      </View>
    );
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <ScrollView style={styles.container}>
      <AccordionItem title={`Past 1 Month (${appsByUpdate.past1Month.length})`}>
        {appsByUpdate.past1Month.map(renderAppItem)}
      </AccordionItem>
      <AccordionItem
        title={`Past 3 Months (${appsByUpdate.past3Month.length})`}>
        {appsByUpdate.past3Month.map(renderAppItem)}
      </AccordionItem>
      <AccordionItem
        title={`Past 6 Months (${appsByUpdate.past6Month.length})`}>
        {appsByUpdate.past6Month.map(renderAppItem)}
      </AccordionItem>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  accordionItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  accordionHeader: {
    backgroundColor: '#f2f2f2',
    padding: 15,
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 10,
    backgroundColor: '#fff',
  },
  appItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  appName: {
    fontSize: 16,
  },
});

export default AppUpdates;
