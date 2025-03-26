import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Linking,
} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';
import {apiService} from '@services/index';
import FullScreenLoader from '@components/full-screen-loader';
import CustomText from '@components/ui/custom-text';

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

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!newsList || newsList.length === 0) {
    return (
      <CustomText
        variant="h1"
        fontFamily="Montserrat-Bold"
        color="white"
        style={{textAlign: 'center'}}>
        No news available
      </CustomText>
    );
  }

  const renderItem = ({item}: {item: NewsItem}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => Linking.openURL(item.url)}>
      {item.urlToImage ? (
        <Image
          source={{uri: item.urlToImage}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.noImage]}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
      <View style={styles.content}>
        <CustomText variant="h2" fontFamily="Montserrat-Bold" color="#000">
          {item.title}
        </CustomText>
        <CustomText variant="h6" fontFamily="Montserrat-Regular" color="#333">
          {item.description}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={newsList}
        keyExtractor={(item, index) => item.url + index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default CyberNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  noImage: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    color: '#fff',
  },
  content: {
    padding: 10,
  },
});
