import {useEffect, useMemo, useState} from 'react';
import CustomText from './ui/custom-text';
import {ActivityIndicator, Card, Divider} from 'react-native-paper';
import {Image, Linking, StyleSheet, View} from 'react-native';
import CustomButton from './ui/custom-button';
import NoImage from '@assets/images/noimage.png';
import Loader from './loader';

interface ScannerResultProps {
  stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
  };
  meta: {
    url_info: {
      id: string;
      url: string;
    };
  };
}
export const ScannerResult = ({stats, meta}: ScannerResultProps) => {
  // Calculate security score
  const {securityScore, confidenceFlag, siteGrade} = useMemo(() => {
    const {malicious, suspicious, undetected, harmless} = stats;
    const confidence = harmless + undetected >= 10 * (malicious + suspicious);
    const totalRelevant = malicious + suspicious + harmless + undetected;

    if (totalRelevant === 0) {
      return {securityScore: 0, confidenceFlag: false, siteGrade: 'F'};
    }

    // Handle case where there are no threats (malicious + suspicious = 0)
    if (malicious + suspicious === 0) {
      return {
        securityScore: 100,
        confidenceFlag: confidence,
        siteGrade: 'A',
      };
    }

    const threatSeverity = malicious * 100 + suspicious * 50;
    const maxThreatSeverity = (malicious + suspicious) * 100;
    let rawScore = 100 - (threatSeverity / maxThreatSeverity) * 100;

    if (confidence) {
      const boostCap = malicious > 0 ? 70 : 90;
      rawScore = Math.max(rawScore, boostCap);
    }
    const roundedScore = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Determine site grade based on security score
    let grade;
    if (roundedScore >= 90) grade = 'A';
    else if (roundedScore >= 80) grade = 'B';
    else if (roundedScore >= 70) grade = 'C';
    else if (roundedScore >= 60) grade = 'D';
    else grade = 'F';

    return {
      securityScore: roundedScore,
      confidenceFlag: confidence,
      siteGrade: grade,
    };
  }, [stats]);

  // Determine safety status based on securityScore
  const safetyStatus = useMemo(() => {
    if (stats.malicious > 0 && !confidenceFlag) return 'unsafe';
    if (stats.malicious > 0) return 'moderate';
    if (securityScore >= 85) return 'safe';
    if (securityScore >= 65) return 'moderate';
    return 'unsafe';
  }, [securityScore, stats, confidenceFlag]);

  const getSafetySynopsis = (safetyStatus: string, securityScore: number) => {
    switch (safetyStatus) {
      case 'safe':
        return {
          short: 'URL is safe and from a trusted source.',
          long: 'This URL has passed comprehensive security checks with no significant threats detected. It originates from a reputable source with strong safety indicators across multiple security engines.',
        };
      case 'moderate':
        return {
          short: 'Use caution; the URL may be suspicious.',
          long: 'This URL shows security concerns that require caution. While not overtly malicious, it exhibits suspicious characteristics that warrant careful evaluation.',
        };
      case 'unsafe':
        return securityScore > 30
          ? {
              short: 'Potentially dangerous URL with multiple concerns.',
              long: 'This URL exhibits multiple security concerns with potential malicious elements. Proceeding may expose your system to unnecessary risks.',
            }
          : {
              short: 'Confirmed malicious URL. Avoid visiting.',
              long: 'This URL has been identified as an active security threat with confirmed malicious content. Visiting may compromise your device or data.',
            };
      default:
        return {
          short: 'Security assessment in progress.',
          long: 'Security scan is currently underway. Please wait for results.',
        };
    }
  };

  const synopsis = useMemo(
    () => getSafetySynopsis(safetyStatus, securityScore),
    [safetyStatus, securityScore],
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'safe':
        return '#00FF7F'; // greenish #00FF7F
      case 'moderate':
        return '#FFA500'; // orange #FFA500
      case 'unsafe':
        return '#FF4C4C'; // red #FF4C4C
      default:
        return '#FFFFFF'; // fallback white #FFFFFF
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
          <Favicon domain={meta.url_info.url} />
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
        domain={meta.url_info.url}
        getStatusColor={getStatusColor}
        safetyStatus={safetyStatus}
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
        onPress={() => {
          Linking.openURL(meta.url_info.url);
        }}
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
  domain: string;
  getStatusColor: (status: string) => string;
  safetyStatus?: string;
}
const WhoisCard = ({domain, getStatusColor, safetyStatus}: WhoisCardProps) => {
  const [whoisData, setWhoisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWhoisData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://api.whoisfreaks.com/v1.0/whois?whois=live&domainName=${domain}&apiKey=5c7fea39abf4463ba23afab7da0a50fb`,
        );
        const data = await response.json();
        if (data.error) {
          setError(data.error);
        } else {
          setWhoisData(data);
        }
      } catch (err) {
        setError('Failed to fetch WHOIS data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (domain) {
      fetchWhoisData();
    }
  }, [domain]);

  const getYearsAgo = (pastDateString: string): string => {
    const pastDate = new Date(pastDateString);
    const now = new Date();

    let yearsAgo = now.getFullYear() - pastDate.getFullYear();

    const hasNotHadBirthdayThisYear =
      now.getMonth() < pastDate.getMonth() ||
      (now.getMonth() === pastDate.getMonth() &&
        now.getDate() < pastDate.getDate());

    if (hasNotHadBirthdayThisYear) {
      yearsAgo -= 1;
    }

    return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
  };

  console.log(whoisData);

  return (
    <>
      <Card
        style={[
          styles.card,
          {borderColor: getStatusColor(safetyStatus!), borderWidth: 3},
        ]}>
        <Card.Content>
          {loading ? (
            <Loader />
          ) : (
            <>
              {whoisData && (
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
                    {whoisData?.create_date ? (
                      <CustomText
                        color={getStatusColor(safetyStatus!)}
                        variant="h5"
                        fontFamily="Montserrat-SemiBold">
                        {getYearsAgo(whoisData?.create_date)}
                        {/* {whoisData?.create_date} */}
                      </CustomText>
                    ) : (
                      <CustomText
                        color={getStatusColor(safetyStatus!)}
                        variant="h5"
                        fontFamily="Montserrat-SemiBold">
                        N/A
                      </CustomText>
                    )}
                  </View>

                  <View style={styles.cardItemContainer}>
                    <CustomText
                      color="#FFF"
                      variant="h5"
                      fontFamily="Montserrat-SemiBold">
                      Country Of Origin
                    </CustomText>

                    {whoisData?.registrant_contact?.country_name ? (
                      <CustomText
                        color={getStatusColor(safetyStatus!)}
                        variant="h5"
                        fontFamily="Montserrat-SemiBold">
                        {whoisData?.registrant_contact?.country_name}
                      </CustomText>
                    ) : (
                      <CustomText
                        color={getStatusColor(safetyStatus!)}
                        variant="h5"
                        fontFamily="Montserrat-SemiBold">
                        N/A
                      </CustomText>
                    )}
                  </View>
                </>
              )}
            </>
          )}
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
