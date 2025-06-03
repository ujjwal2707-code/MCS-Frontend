import BackBtn from '@components/back-btn';
import ScreenHeader from '@components/screen-header';
import ScreenLayout from '@components/screen-layout';
import CustomText from '@components/ui/custom-text';
import {RootScreenProps} from '@navigation/types';
import {Image, StyleSheet, View} from 'react-native';
import {Card, Divider} from 'react-native-paper';
import {InstalledAppStats} from 'types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DataUsageDetails: React.FC<RootScreenProps> = ({route}) => {
  const {app} = route.params as {app: InstalledAppStats};

  const formatMBtoGBandMB = (mb: number): string => {
    const gb = Math.floor(mb / 1024); // 1 GB = 1024 MB
    const remainingMB = (mb % 1024).toFixed(2);

    if (gb > 0) {
      return `${gb} GB ${remainingMB} MB`;
    }
    return `${remainingMB} MB`;
  };
  return (
    <ScreenLayout>
      <ScreenHeader />

      <Card style={styles.card}>
        <Card.Content>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {app.icon ? (
              <Image
                source={{uri: `data:image/png;base64,${app.icon}`}}
                style={styles.appIcon}
              />
            ) : (
              <CustomText style={styles.noIcon}>No Icon</CustomText>
            )}
            <CustomText variant="h3" fontFamily="Montserrat-Bold" color="#fff">
              {app.name}
            </CustomText>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.cardItemContainer}>
            <CustomText
              color="#FFF"
              variant="h5"
              fontFamily="Montserrat-Regular">
              Daily Usage
            </CustomText>

            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Ionicons name="arrow-up" size={20} color="green" />
                <CustomText
                  color="#fff"
                  variant="h6"
                  fontFamily="Montserrat-Regular">
                  {formatMBtoGBandMB(app.dailyDataUsage.transmitted)}
                </CustomText>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Ionicons name="arrow-down" size={20} color="red" />
                <CustomText
                  variant="h6"
                  color="#fff"
                  fontFamily="Montserrat-Regular">
                  {formatMBtoGBandMB(app.dailyDataUsage.received)}
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.cardItemContainer}>
            <CustomText
              color="#FFF"
              variant="h5"
              fontFamily="Montserrat-Regular">
              Weekly Usage
            </CustomText>

            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Ionicons name="arrow-up" size={20} color="green" />
                <CustomText
                  color="#fff"
                  variant="h6"
                  fontFamily="Montserrat-Regular">
                  {formatMBtoGBandMB(app.weeklyDataUsage.transmitted)}
                </CustomText>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Ionicons name="arrow-down" size={20} color="red" />
                <CustomText
                  variant="h6"
                  color="#fff"
                  fontFamily="Montserrat-Regular">
                  {formatMBtoGBandMB(app.weeklyDataUsage.received)}
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.cardItemContainer}>
            <CustomText
              color="#FFF"
              variant="h5"
              fontFamily="Montserrat-Regular">
              Monthly Usage
            </CustomText>

            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Ionicons name="arrow-up" size={20} color="green" />
                <CustomText
                  color="#fff"
                  variant="h6"
                  fontFamily="Montserrat-Regular">
                  {formatMBtoGBandMB(app.monthlyDataUsage.transmitted)}
                </CustomText>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}>
                <Ionicons name="arrow-down" size={20} color="red" />
                <CustomText
                  variant="h6"
                  color="#fff"
                  fontFamily="Montserrat-Regular">
                  {formatMBtoGBandMB(app.monthlyDataUsage.received)}
                </CustomText>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      <BackBtn />
    </ScreenLayout>
  );
};

export default DataUsageDetails;

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    backgroundColor: '#2337A8',
    marginTop: 20,
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
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  cardItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
