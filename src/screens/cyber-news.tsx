import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Linking,
  SafeAreaView
} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {apiService} from '@services/index';
import CustomText from '@components/ui/custom-text';
import LinearGradient from 'react-native-linear-gradient';
import ScreenHeader from '@components/screen-header';
import CustomButton from '@components/ui/custom-button';
import Loader from '@components/loader';

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

  const renderItem = ({item}: {item: NewsItem}) => (
    <View style={styles.itemContainer}>
      {item.urlToImage ? (
        <Image
          source={{uri: item.urlToImage}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View>
          No Image Available.
        </View>
      )}
      <View style={styles.content}>
        <CustomText variant="h5" fontFamily="Montserrat-Bold" color="#fff">
          {item.title}
        </CustomText>
        <View style={{marginTop:10}}>
        <CustomText variant="h6" fontFamily="Montserrat-Regular" color="#fff">
          {item.description}
        </CustomText>
        </View>
        

        <View style={{marginTop: 10}}>
          <CustomButton
            bgVariant="outline"
            title="Read More"
            onPress={() => Linking.openURL(item.url)}
            style={{borderWidth: 1,borderColor: '#fff'}}
          />
        </View>
      </View>
    </View>
  );

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
          <FlatList
            data={newsList}
            keyExtractor={(item, index) => item.url + index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
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
  image: {
    width: '100%',
    height: 200,
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
});
