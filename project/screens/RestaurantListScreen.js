import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import commonStyles from '../styles/common';
import homeStyles from '../styles/home';

import BackHeader from '../components/BackHeader';
import FilterChip from '../components/FilterChip';
import RestaurantListCard from '../components/RestaurantListCard';
import { fetchRestaurants } from '../store/restaurantSlice';
import {
  toggleRestaurantFavorite,
  fetchFavoriteRestaurants,
} from '../store/favoriteSlice';

export default function RestaurantListScreen({ navigation, route }) {
  const { categoryName, filter } = route.params ?? {};
  const dispatch = useDispatch();
  const restaurants = useSelector(state => state.restaurant.items);
  const status = useSelector(state => state.restaurant.status);
  const error = useSelector(state => state.restaurant.error);
  const filters = ['All', 'Top Rated'];
  const [selectedFilter, setSelectedFilter] = useState(filter || 'All');
  const favoriteRestaurantIds = useSelector(
    state => state.favorite.restaurantIds,
  );

  const handleFavorite = restaurant => {
    dispatch(toggleRestaurantFavorite(restaurant.id));
  };

  useEffect(() => {
    dispatch(fetchRestaurants({ pageNumber: 1, pageSize: 100 }));
    dispatch(fetchFavoriteRestaurants({ pageNumber: 1, pageSize: 100 }));
  }, [dispatch]);
  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];
    if (categoryName) {
      result = result.filter(restaurant =>
        restaurant.categories?.some(
          category =>
            String(category).toLowerCase() ===
            String(categoryName).toLowerCase(),
        ),
      );
    }
    if (selectedFilter === 'Top Rated') {
      result = result.filter(
        restaurant => Number(restaurant.rating ?? 0) >= 4.9,
      );
    }
    return result;
  }, [restaurants, categoryName, selectedFilter]);
  if (status === 'loading') {
    return (
      <SafeAreaView style={commonStyles.screen} edges={['top', 'bottom']}>
        {' '}
        <BackHeader
          title={categoryName || 'Restaurants'}
          subtitle="Loading restaurants..."
        />{' '}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          {' '}
          <ActivityIndicator size="large" />{' '}
        </View>{' '}
      </SafeAreaView>
    );
  }
  if (status === 'failed') {
    return (
      <SafeAreaView style={commonStyles.screen} edges={['top', 'bottom']}>
        {' '}
        <BackHeader
          title={categoryName || 'Restaurants'}
          subtitle="Unable to load restaurants"
        />{' '}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          {' '}
          <Text> Failed to load restaurants. </Text>{' '}
          {error && (
            <Text style={{ marginTop: 8, textAlign: 'center' }}> {error} </Text>
          )}{' '}
        </View>{' '}
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'bottom']}>
      <BackHeader
        title={categoryName || 'Restaurants'}
        subtitle={`${filteredRestaurants.length} restaurants`}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContainer}
      >
        <View style={homeStyles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map(filter => (
              <FilterChip
                key={filter}
                title={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
              />
            ))}
          </ScrollView>
        </View>

        {filteredRestaurants.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text>No restaurants found.</Text>
          </View>
        ) : (
          filteredRestaurants.map(restaurant => (
            <RestaurantListCard
              key={restaurant.id}
              item={restaurant}
              favorite={favoriteRestaurantIds.includes(restaurant.id)}
              onPress={() =>
                navigation.navigate('RestaurantDetail', {
                  restaurantId: restaurant.id,
                })
              }
              onFavoritePress={() => handleFavorite(restaurant)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
