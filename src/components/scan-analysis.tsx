import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Card} from 'react-native-paper';
import CustomText from './ui/custom-text';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ScanAnalysis = ({
  category,
  engines,
  count,
  color,
}: {
  category: string;
  engines: string[];
  count: number;
  color: string;
}) => {
  const [expandedCategories, setExpandedCategories] = useState({
    malicious: false,
    suspicious: false,
    harmless: false,
    undetected: false,
    timeout: false,
  });

  const toggleCategory = (category: keyof typeof expandedCategories) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const isExpanded =
    expandedCategories[
      category.toLowerCase() as keyof typeof expandedCategories
    ];

  return (
    <Card style={[styles.categoryCard, {backgroundColor: color}]}>
      <TouchableOpacity
        onPress={() =>
          toggleCategory(
            category.toLowerCase() as keyof typeof expandedCategories,
          )
        }
        style={styles.categoryHeader}>
        <View style={styles.categoryTitle}>
          <CustomText variant="h5" fontFamily="Montserrat-Bold">
            {category} ({count})
          </CustomText>
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="white"
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={{paddingHorizontal: 10, paddingBottom: 10}}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}>
            {engines.map((engine, index) => (
              <View
                key={index.toString()}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 20,
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  margin: 4,
                }}>
                <CustomText variant="h6" fontSize={14} fontFamily='Montserrat-Medium'>
                  {engine}
                </CustomText>
              </View>
            ))}
          </View>
        </View>
      )}
    </Card>
  );
};

export default ScanAnalysis;

const styles = StyleSheet.create({
  categoryHeader: {
    padding: 16,
  },
  categoryTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryCard: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    // maxHeight: 300,
  },
  engineItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
});
