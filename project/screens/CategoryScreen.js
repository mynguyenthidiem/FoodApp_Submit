import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackHeader from '../components/BackHeader';
import SearchBar from '../components/SearchBar';
import FilterChip from '../components/FilterChip';
import FeaturedCategoryCard from '../components/FeaturedCategoryCard';
import CollectionCard from '../components/CollectionCard';

import commonStyles from '../styles/common';
import homeStyles from '../styles/home';
import orderStyles from '../styles/order';

import {
  getSystemCategories,
  searchSystemCategories,
} from '../services/categoryService';
import { getAllRestaurants } from '../services/restaurantService';

export default function CategoryScreen({ navigation }) {
  const filters = ['All Categories', 'Top Rated'];

  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [keyword, setKeyword] = useState('');

  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const categoryResponse = await getSystemCategories();
      const restaurantResponse = await getAllRestaurants(1, 100);

      const categoryData = categoryResponse ?? [];
      const restaurantData = restaurantResponse?.items ?? [];

      setCategories(categoryData);
      setAllCategories(categoryData);
      setRestaurants(restaurantData);
    } catch (error) {
      console.log('Loading category data failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    const text = keyword.trim();

    if (!text) {
      setSearching(false);
      setCategories(allCategories);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const result = await searchSystemCategories(text);

        setCategories(result ?? []);
      } catch (error) {
        console.log('Search category failed:', error);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword, allCategories]);

  const handleFilter = filter => {
    setSelectedFilter(filter);
    setKeyword('');

    if (filter === 'All Categories') {
      setCategories(allCategories);
      return;
    }

    if (filter === 'Top Rated') {
      const topRatedRestaurants = restaurants.filter(
        restaurant => Number(restaurant.rating) >= 4.9,
      );

      const topCategories = [];

      topRatedRestaurants.forEach(restaurant => {
        restaurant.categories?.forEach(category => {
          if (!topCategories.includes(category)) {
            topCategories.push(category);
          }
        });
      });

      const result = allCategories.filter(category =>
        topCategories.includes(category.name),
      );

      setCategories(result);
    }
  };

  const sections = [];

  for (let i = 0; i < categories.length; i += 3) {
    sections.push({
      featured: categories[i],
      smalls: categories.slice(i + 1, i + 3),
    });
  }

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'bottom']}>
      <BackHeader title="Categories" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContainer}
      >
        <SearchBar value={keyword} onChangeText={setKeyword} />

        <View style={homeStyles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map(filter => (
              <FilterChip
                key={filter}
                title={filter}
                selected={selectedFilter === filter && !keyword.trim()}
                onPress={() => handleFilter(filter)}
              />
            ))}
          </ScrollView>
        </View>

        {loading || searching ? (
          <ActivityIndicator size="large" />
        ) : categories.length === 0 ? (
          <Text style={orderStyles.emptyText}>
            {keyword.trim()
              ? `No categories found for "${keyword.trim()}"`
              : 'No categories available.'}
          </Text>
        ) : (
          sections.map(section => (
            <View key={section.featured.id}>
              <FeaturedCategoryCard
                item={{
                  id: section.featured.id,
                  title: section.featured.name,
                  subtitle: section.featured.description || 'Food Category',
                  image: section.featured.image,
                }}
                onPress={() =>
                  navigation.navigate('RestaurantList', {
                    categoryId: section.featured.id,
                    categoryName: section.featured.name,
                  })
                }
              />

              {section.smalls.length > 0 && (
                <View style={homeStyles.collectionRow}>
                  {section.smalls.map(category => (
                    <CollectionCard
                      key={category.id}
                      item={{
                        id: category.id,
                        name: category.name,
                        subtitle: category.description || 'Food Category',
                        image: category.image,
                      }}
                      onPress={() =>
                        navigation.navigate('RestaurantList', {
                          categoryId: category.id,
                          categoryName: category.name,
                        })
                      }
                    />
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}