import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import commonStyles from '../styles/common';
import homeStyles from '../styles/home';
import { COLORS } from '../styles/theme';

import SearchBar from '../components/SearchBar';
import FilterChip from '../components/FilterChip';
import RestaurantCard from '../components/RestaurantCard';
import FoodCard from '../components/FoodCard';

import { useDispatch, useSelector } from 'react-redux';

import {
  fetchRestaurants,
  searchRestaurantsAsync,
  fetchTopRatedRestaurants,
  fetchOpenNowRestaurants,
} from '../store/restaurantSlice';
import {
  fetchFoods,
  fetchSearchFoods,
  clearSearchResults,
} from '../store/foodSlice';
import { toggleFavorite } from '../store/favoriteSlice';

export default function SearchScreen({ navigation }) {
  const filterChips = ['All', 'Top Rated', 'Open'];

  const [keyword, setKeyword] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const dispatch = useDispatch();

  const {
    items: restaurants,
    topRatedItems,
    openNowItems,
    status: restaurantStatus,
    error: restaurantError,
  } = useSelector(state => state.restaurant);
  const {
    items: foods,
    searchResults,
    status: foodStatus,
    error: foodError,
  } = useSelector(state => state.food);

  const favoriteIds = useSelector(state => state.favorite.items);
  const handleFavorite = item => {
    dispatch(toggleFavorite(item.id));
  };

  const displayedRestaurants = useMemo(() => {
    if (selectedFilter === 'Top Rated') {
      return topRatedItems;
    }

    if (selectedFilter === 'Open') {
      return openNowItems;
    }

    return restaurants;
  }, [
    selectedFilter,
    restaurants,
    topRatedItems,
    openNowItems,
  ]);
  const suggestedRestaurants = useMemo(
    () => displayedRestaurants.slice(0, 3),
    [displayedRestaurants],
  );

  const suggestedFoods = useMemo(() => foods.slice(0, 8), [foods]);

  useEffect(() => {
    dispatch(
      fetchFoods({
        pageNumber: 1,
        pageSize: 20,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const text = keyword.trim();

    if (!text) {
      dispatch(clearSearchResults());
      return;
    }

    const timer = setTimeout(() => {
      dispatch(
        fetchSearchFoods({
          keyword: text,
          pageNumber: 1,
          pageSize: 20,
        }),
      );

      dispatch(
        searchRestaurantsAsync({
          keyword: text,
          pageNumber: 1,
          pageSize: 20,
        }),
      );
    }, 400);

    return () => clearTimeout(timer);
  }, [dispatch, keyword]);

  useEffect(() => {
    if (keyword.trim()) {
      return;
    }

    if (selectedFilter === 'All') {
      dispatch(
        fetchRestaurants({
          pageNumber: 1,
          pageSize: 20,
        }),
      );
    }

    if (selectedFilter === 'Top Rated') {
      dispatch(fetchTopRatedRestaurants(10));
    }

    if (selectedFilter === 'Open') {
      dispatch(
        fetchOpenNowRestaurants({
          pageNumber: 1,
          pageSize: 20,
        }),
      );
    }
  }, [dispatch, selectedFilter, keyword]);

  if (
    (restaurantStatus === 'loading' && restaurants.length === 0) ||
    (foodStatus === 'loading' && foods.length === 0)
  ) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={[commonStyles.centerContainer, { flex: 1 }]}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={{ marginTop: 12 }}>
            {keyword.trim() ? 'Searching...' : 'Loading...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  if (restaurantStatus === 'failed' || foodStatus === 'failed') {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={[commonStyles.centerContainer, { flex: 1 }]}>
          <Text>{restaurantError || foodError || 'Failed to load data.'}</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={commonStyles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContainer}
      >
        <SearchBar value={keyword} onChangeText={setKeyword} />

        <View style={homeStyles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterChips.map(filter => (
              <FilterChip
                key={filter}
                title={filter}
                selected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
              />
            ))}
          </ScrollView>
        </View>
        {!keyword.trim() && (
          <>
            <Text
              style={[
                homeStyles.sectionTitle,
                {
                  marginTop: 24,
                  marginBottom: 16,
                },
              ]}
            >
              Restaurants
            </Text>

            {suggestedRestaurants.map(restaurant => (
              <RestaurantCard
                key={restaurant.id}
                image={restaurant.imageUrl}
                name={restaurant.name}
                address={restaurant.address}
                rating={restaurant.rating}
                totalReviews={restaurant.totalReviews}
                deliveryFee={restaurant.deliveryFee}
                isActive={restaurant.isActive}
                onPress={() =>
                  navigation.navigate('RestaurantDetail', {
                    restaurantId: restaurant.id,
                  })
                }
              />
            ))}

            <Text
              style={[
                homeStyles.sectionTitle,
                {
                  marginTop: 24,
                  marginBottom: 16,
                },
              ]}
            >
              Explore Foods
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedFoods.map(food => (
                <FoodCard
                  key={food.id}
                  item={{ ...food, favorite: favoriteIds.includes(food.id) }}
                  onPress={() =>
                    navigation.navigate('FoodDetail', {
                      foodId: food.id,
                    })
                  }
                  onFavoritePress={handleFavorite}
                />
              ))}
            </ScrollView>
          </>
        )}

        {keyword.trim() && (
          <>
            <Text
              style={[
                homeStyles.sectionTitle,
                {
                  marginTop: 24,
                  marginBottom: 16,
                },
              ]}
            >
              Restaurants
            </Text>

            {restaurants.length === 0 ? (
              <Text style={homeStyles.emptySearchText}>
                No restaurants found.
              </Text>
            ) : (
              restaurants.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  image={restaurant.imageUrl}
                  name={restaurant.name}
                  address={restaurant.address}
                  rating={restaurant.rating}
                  totalReviews={restaurant.totalReviews}
                  deliveryFee={restaurant.deliveryFee}
                  isActive={restaurant.isActive}
                  onPress={() =>
                    navigation.navigate('RestaurantDetail', {
                      restaurantId: restaurant.id,
                    })
                  }
                />
              ))
            )}

            <Text
              style={[
                homeStyles.sectionTitle,
                {
                  marginTop: 24,
                  marginBottom: 16,
                },
              ]}
            >
              Dishes
            </Text>

            {searchResults.length === 0 ? (
              <Text style={homeStyles.emptySearchText}>
                No matching foods found.
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {searchResults.map(food => (
                  <FoodCard
                    key={food.id}
                    item={{ ...food, favorite: favoriteIds.includes(food.id) }}
                    onFavoritePress={handleFavorite}
                    onPress={() =>
                      navigation.navigate('FoodDetail', {
                        foodId: food.id,
                      })
                    }
                  />
                ))}
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
