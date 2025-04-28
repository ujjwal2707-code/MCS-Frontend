import {
  View,
  Image,
  StyleSheet,
  Linking,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {apiService} from '@services/index';
import CustomText from '@components/ui/custom-text';
import LinearGradient from 'react-native-linear-gradient';
import ScreenHeader from '@components/screen-header';
import CustomButton from '@components/ui/custom-button';
import Loader from '@components/loader';
import AlertBox from '@components/alert-box';
import BackBtn from '@components/back-btn';
import Swiper from 'react-native-swiper';
import {AlertContext} from '@context/alert-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface NewsItem {
  source: {id: string; name: string};
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
}
const CyberNews = () => {
  const {
    data: newsList,
    isLoading,
    error,
  } = useQuery<NewsItem[]>({
    queryKey: ['news'],
    queryFn: async () => {
      const response = await apiService.getCyberNews();
      if (!response) {
        throw new Error('API call failed: No response received.');
      }
      if (response.status !== 200) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`,
        );
      }
      if (!response.data || !response.data.success) {
        throw new Error('Invalid API response format.');
      }
      return response.data.data;
    },
    staleTime: 0,
    retry: true,
  });

  // Alert Box
  const {alertSettings, setAlertSetting} = useContext(AlertContext);
  const alertKey = 'cyberNews';
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

  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Get the device width to ensure each slide fills the screen
  const {width, height} = Dimensions.get('window');

  // const swiperHeight = 800;
  const swiperHeight = height;

  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bounceAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0A1D4D', '#08164C']}
        style={styles.gradientBackground}>
        <View style={{padding: 20}}>
          <ScreenHeader name="Cyber News" />
        </View>

        {isLoading ? (
          <Loader />
        ) : (
          <>
            <View style={{width, height: swiperHeight}}>
              <Swiper
                horizontal={false}
                ref={swiperRef}
                loop={false}
                onIndexChanged={(index: number) => setActiveIndex(index)}
                containerStyle={{width, height: swiperHeight}}
                showsPagination={false}>
                {newsList?.map((item: NewsItem, index) => (
                  <View
                    key={index}
                    style={[
                      styles.slideContainer,
                      {width, height: swiperHeight},
                    ]}>
                    {item.urlToImage ? (
                      <Image
                        source={{uri: item.urlToImage}}
                        style={styles.image}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.noImageContainer}>
                        <CustomText color="#fff">
                          No Image Available.
                        </CustomText>
                      </View>
                    )}
                    <View style={styles.content}>
                      <CustomText
                        variant="h5"
                        fontFamily="Montserrat-Bold"
                        color="#fff">
                        {item.title}
                      </CustomText>
                      <View style={{marginTop: 10}}>
                        <CustomText
                          variant="h5"
                          fontSize={14}
                          fontFamily="Montserrat-Regular"
                          color="#fff">
                          {item.description}
                        </CustomText>
                      </View>
                      <View style={{marginTop: 20}}>
                        <CustomButton
                          bgVariant="outline"
                          textVariant="secondary"
                          title="Read More"
                          onPress={() => Linking.openURL(item.url)}
                          style={{borderWidth: 1, borderColor: '#fff'}}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </Swiper>
            </View>
          </>
        )}

        {modalVisible && (
          <AlertBox
            isOpen={modalVisible}
            onClose={closeModal}
            onDontShowAgain={handleDontShowAgain}>
            <CustomText
              fontFamily="Montserrat-Medium"
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              Cyber threats evolve rapidly, and staying informed is key to
              protection. Real-time updates on major breaches, security alerts,
              and expert advice help users stay ahead of potential risks.
            </CustomText>
          </AlertBox>
        )}

        {activeIndex === 0 && (
          <Animated.View
            style={[
              styles.hintContainer,
              {transform: [{translateY: bounceAnim}]},
            ]}>
            <Ionicons name="arrow-up" size={24} color="white" />
            <CustomText
              style={styles.hintText}
              color="#fff"
              fontFamily="Montserrat-Bold">
              Swipe up to see more news
            </CustomText>
          </Animated.View>
        )}
        <BackBtn />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CyberNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  slideContainer: {
    padding: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  noImageContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  content: {
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 40,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:4,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
