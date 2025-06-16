import {useMemo, useState} from 'react';
import CustomText from './ui/custom-text';
import {ActivityIndicator, Card, Divider} from 'react-native-paper';
import {Image, Linking, StyleSheet, View} from 'react-native';
import CustomButton from './ui/custom-button';
import NoImage from '@assets/images/noimage.png';
import {DomainReputationResponse} from 'types/types';

interface ScannerResultProps {
  inputURI:string;
  data: DomainReputationResponse;
}

const DomainsList = [
  "http://grabify.link",
  "http://iplogger.org",
  "http://blasze.com",
  "http://yip.su",
  "http://2no.co",
  "http://bmw.bz",
  "http://ip-tracker.org",
  "http://trackurl.com",
  "http://whatstheirip.com",
  "http://opentracker.net",
  "http://tracemyip.org",
  "http://logger.com",
  "http://ipgrabber.ru",
  "http://ipspy.org",
  "http://anonymz.com",
  "http://anonysend.com",
  "http://iplogger.co",
  "http://xresolver.com",
  "http://spyurl.net",
  "http://gyazo.com"
]

export const ScannerResult = ({inputURI,data}: ScannerResultProps) => {
  const {
    host,
    blacklists,
    server_details,
    security_checks,
    risk_score,
    domain_info,
  } = data;

  // Convert risk score to security score (0-100 scale where higher is safer)
  const securityScore = 100 - risk_score.result;
  const detections = blacklists.detections;

  // Determine site grade based on security score
  const siteGrade = useMemo(() => {
    if (securityScore >= 90) return 'A';
    if (securityScore >= 80) return 'B';
    if (securityScore >= 70) return 'C';
    if (securityScore >= 60) return 'D';
    return 'F';
  }, [securityScore]);

  // Determine safety status (higher risk_score = more dangerous)
  const safetyStatus = useMemo(() => {
    if (detections === 0 && securityScore >= 85) return 'safe';
    if (securityScore >= 65) return 'moderate';
    return 'unsafe';
  }, [securityScore, detections]);

  // Get safety synopsis
  const synopsis = useMemo(() => {
    switch (safetyStatus) {
      case 'safe':
        return {
          short: 'URL is safe and from a trusted source.',
          long: 'This URL has passed comprehensive security checks with no significant threats detected. It originates from a reputable source with strong safety indicators across multiple security engines.',
        };
      case 'moderate':
        return {
          short: 'Use caution; the URL may be suspicious.',
          long: `This URL was flagged by ${detections} security engine${
            detections > 1 ? 's' : ''
          }. While not overtly malicious, it exhibits suspicious characteristics that warrant careful evaluation.`,
        };
      case 'unsafe':
        return securityScore > 30
          ? {
              short: 'Potentially dangerous URL with multiple concerns.',
              long: `This URL was flagged by ${detections} security engine${
                detections > 1 ? 's' : ''
              } and shows a high-risk profile (${
                risk_score.result
              }/100 risk score). Proceeding may expose your system to unnecessary risks.`,
            }
          : {
              short: 'Confirmed malicious URL. Avoid visiting.',
              long: `This URL has been identified as an active security threat with confirmed malicious content. Visiting may compromise your device or data.`,
            };
      default:
        return {
          short: 'Security assessment in progress.',
          long: 'Security scan is currently underway. Please wait for results.',
        };
    }
  }, [safetyStatus, detections, securityScore, risk_score.result]);

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'safe':
        return '#00FF7F'; // Green
      case 'moderate':
        return '#FFA500'; // Orange
      case 'unsafe':
        return '#FF4C4C'; // Red
      default:
        return '#FFFFFF'; // White
    }
  };

  return (
    <>
      <View
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: '70%',
            backgroundColor: getStatusColor(safetyStatus),
            borderRadius: 20,
          }}>
          <CustomText
            color="#FFF"
            variant="h2"
            fontFamily="Montserrat-Bold"
            style={{textAlign: 'center'}}>
            {safetyStatus.toUpperCase()}
          </CustomText>
        </View>
      </View>
      <Card
        style={[
          styles.card,
          {borderColor: getStatusColor(safetyStatus), borderWidth: 3},
        ]}>
        <Card.Content>
          <Favicon domain={inputURI} />
          <CustomText
            color="#FFF"
            variant="h2"
            fontFamily="Montserrat-Bold"
            style={{textAlign: 'center'}}>
            Risk Analysis
          </CustomText>
          <Divider style={styles.divider} />

          <View style={styles.cardItemContainer}>
            <CustomText
              color="#FFF"
              variant="h5"
              fontFamily="Montserrat-SemiBold">
              Security Score
            </CustomText>
            <CustomText
              color={getStatusColor(safetyStatus)}
              variant="h5"
              fontFamily="Montserrat-Bold">
              {securityScore}/100
            </CustomText>
          </View>

          <View style={styles.cardItemContainer}>
            <CustomText
              color="#FFF"
              variant="h5"
              fontFamily="Montserrat-SemiBold">
              Site Grade
            </CustomText>
            <CustomText
              color={getStatusColor(safetyStatus)}
              variant="h5"
              fontFamily="Montserrat-Bold">
              {siteGrade}
            </CustomText>
          </View>

          <View style={styles.synopsisContainer}>
            <CustomText
              color="#FFF"
              variant="h5"
              fontFamily="Montserrat-SemiBold"
              style={styles.synopsisLabel}>
              Synopsis
            </CustomText>

            <CustomText
              color={getStatusColor(safetyStatus)}
              variant="h6"
              fontFamily="Montserrat-Bold"
              style={styles.synopsisText}>
              {synopsis.short}
            </CustomText>
          </View>
        </Card.Content>
      </Card>

      <WhoisCard
        getStatusColor={getStatusColor}
        safetyStatus={safetyStatus}
        domainRegisteredData={domain_info.domain_age_in_years}
        serverLoc={server_details.country_name}
      />

      <Card
        style={[
          styles.card,
          {borderColor: getStatusColor(safetyStatus), borderWidth: 3},
        ]}>
        <Card.Content>
          <CustomText
            color={getStatusColor(safetyStatus)}
            variant="h6"
            fontFamily="Montserrat-SemiBold"
            style={{flexShrink: 1, flexWrap: 'wrap', lineHeight: 20}}>
            {synopsis.long}
          </CustomText>
        </Card.Content>
      </Card>

      <CustomButton
        title="Open Link"
        onPress={() => Linking.openURL(`https://${host}`)}
        style={{
          marginTop: 20,
          marginBottom: 10,
          width: '60%',
          alignSelf: 'center',
          backgroundColor: getStatusColor(safetyStatus),
        }}
      />
    </>
  );
};

const Favicon = ({domain}: {domain: string}) => {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const isValidDomain =
    !!domain && typeof domain === 'string' && domain.trim() !== '';

  const sanitizedDomain = useMemo(() => {
    if (!isValidDomain) return '';
    try {
      // Basic URL sanitization
      let url = domain.startsWith('http') ? domain : `https://${domain}`;
      const domainObj = new URL(url);
      return domainObj.hostname;
    } catch {
      return '';
    }
  }, [domain, isValidDomain]);

  const imageSource = useMemo(() => {
    if (!isValidDomain || hasError || !sanitizedDomain) {
      return NoImage;
    }
    return {
      uri: `https://www.google.com/s2/favicons?domain=${sanitizedDomain}&sz=64`,
      cache: 'force-cache',
    };
  }, [sanitizedDomain, isValidDomain, hasError]);

  if (!isValidDomain) {
    return (
      <View style={styles.container}>
        <Image source={NoImage} style={styles.favicon} resizeMode="contain" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && !hasError && (
        <ActivityIndicator size="small" color="#0000ff" />
      )}
      <Image
        source={imageSource}
        style={styles.favicon}
        resizeMode="contain"
        onError={() => {
          setHasError(true);
          setLoading(false);
        }}
        onLoad={() => setLoading(false)}
        onLoadEnd={() => setLoading(false)}
      />
    </View>
  );
};

interface WhoisCardProps {
  getStatusColor: (status: string) => string;
  safetyStatus?: string;
  domainRegisteredData: Number;
  serverLoc: string;
}
const WhoisCard = ({
  getStatusColor,
  safetyStatus,
  domainRegisteredData,
  serverLoc,
}: WhoisCardProps) => {
  return (
    <>
      <Card
        style={[
          styles.card,
          {borderColor: getStatusColor(safetyStatus!), borderWidth: 3},
        ]}>
        <Card.Content>
          <>
            <CustomText
              color="#FFF"
              variant="h4"
              fontFamily="Montserrat-Bold"
              style={{textAlign: 'center'}}>
              Domain Reputation Details
            </CustomText>
            <Divider style={styles.divider} />

            <View style={styles.cardItemContainer}>
              <CustomText
                color="#FFF"
                variant="h5"
                fontFamily="Montserrat-SemiBold">
                Registry Date
              </CustomText>
              <CustomText
                color={getStatusColor(safetyStatus!)}
                variant="h5"
                fontFamily="Montserrat-SemiBold">
                {domainRegisteredData.toString()} years ago.
              </CustomText>
            </View>

            <View style={styles.cardItemContainer}>
              <CustomText
                color="#FFF"
                numberOfLine={2}
                variant="h5"
                fontFamily="Montserrat-SemiBold">
                Server Location
              </CustomText>

              <CustomText
                color={getStatusColor(safetyStatus!)}
                variant="h5"
                fontFamily="Montserrat-SemiBold">
                {serverLoc}
              </CustomText>
            </View>
          </>
        </Card.Content>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    // backgroundColor: 'transparent',
    marginTop: 20,
  },
  cardItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  divider: {
    backgroundColor: '#707070',
    height: 1,
    marginVertical: 8,
    marginHorizontal: 0,
  },
  synopsisContainer: {
    marginTop: 10,
  },
  synopsisLabel: {
    marginBottom: 4,
  },
  synopsisText: {
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
  },

  // Favicon
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  favicon: {
    width: 32,
    height: 32,
  },
});
