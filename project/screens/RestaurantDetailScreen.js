import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Text } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import commonStyles from '../styles/common';

import RestaurantHeroCard from '../components/RestaurantHeroCard';
import RestaurantTabs from '../components/RestaurantTabs';
import FilterChip from '../components/FilterChip';
import MenuSection from '../components/MenuSection';
import ReviewCard from '../components/ReviewCard';
import RestaurantInfoSection from '../components/RestaurantInfoSection';
import RestaurantFeatureSection from '../components/RestaurantFeatureSection';
import CartSummaryBar from '../components/CartSummaryBar';

import { fetchRestaurantById } from '../store/restaurantSlice';
import { fetchFoods } from '../store/foodSlice';
import { fetchFoodReviews } from '../store/reviewSlice';
import { fetchCart, addCartItem } from '../store/cartSlice';
import { toggleRestaurantFavorite } from '../store/favoriteSlice';

export default function RestaurantDetailScreen({ navigation, route }) {
  const { restaurantId } = route.params ?? {};
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const restaurant = useSelector(state => state.restaurant.restaurant);
  const restaurantStatus = useSelector(state => state.restaurant.status);
  const foods = useSelector(state => state.food.items);
  const foodStatus = useSelector(state => state.food.status);
  const reviewsByFood = useSelector(state => state.review.reviewsByFood);
  const reviewStatus = useSelector(state => state.review.status);
  const cartItems = useSelector(state => state.cart.items);
  const cartStatus = useSelector(state => state.cart.status);

  const [selectedTab, setSelectedTab] = useState('Menu');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const favoriteRestaurantIds = useSelector(state => state.favorite.restaurantIds);
  useEffect(() => {
    if (!restaurantId) return;
    dispatch(fetchRestaurantById(restaurantId));
  }, [dispatch, restaurantId]);

  useEffect(() => {
    dispatch(
      fetchFoods({
        pageNumber: 1,
        pageSize: 100,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const restaurantFoods = useMemo(() => {
    if (!restaurantId) {
      return [];
    }
    return foods.filter(
      food => String(food.restaurantId) === String(restaurantId),
    );
  }, [foods, restaurantId]);

  useEffect(() => {
    if (restaurantFoods.length === 0) {
      return;
    }

    restaurantFoods.forEach(food => {
      dispatch(
        fetchFoodReviews({
          foodId: food.id,
          pageNumber: 1,
          pageSize: 20,
        }),
      );
    });
  }, [dispatch, restaurantFoods]);

  const restaurantReviews = useMemo(() => {
    const result = [];
    restaurantFoods.forEach(food => {
      const foodReviews = reviewsByFood[food.id] ?? [];
      result.push(...foodReviews);
    });
    return result;
  }, [restaurantFoods, reviewsByFood]);

  const cartQuantity = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + Number(item.totalPrice ?? 0),
      0,
    );
  }, [cartItems]);

  const menuCategories = useMemo(() => {
    if (!restaurant?.categories) {
      return [];
    }
    return restaurant.categories.map(category => ({
      id: category,
      title: category,
    }));
  }, [restaurant]);

  const menuFilters = useMemo(
    () => [
      {
        id: 'all',
        title: 'All',
      },
      ...menuCategories,
    ],
    [menuCategories],
  );

  const menuSections = useMemo(() => {
    const filteredFoods =
      selectedFilter === 'all'
        ? restaurantFoods
        : restaurantFoods.filter(food => food.categoryName === selectedFilter);

    return menuCategories
      .map(section => ({
        id: section.id,

        title: section.title,

        items: filteredFoods.filter(food => food.categoryName === section.id),
      }))
      .filter(section => section.items.length > 0);
  }, [restaurantFoods, selectedFilter, menuCategories]);

  const handleAddToCart = async food => {
    try {
      await dispatch(
        addCartItem({
          foodId: food.id,

          quantity: 1,
        }),
      ).unwrap();
    } catch (error) {
      console.log('Add cart error:', error);
    }
  };

  const loading = restaurantStatus === 'loading' && !restaurant;

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.screen} edges={['top', 'bottom']}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }
  if (!restaurant) {
    return (
      <SafeAreaView style={commonStyles.screen} edges={['top', 'bottom']}>

        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >

          <Text> Restaurant not found. </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          ...commonStyles.scrollContainer,
          paddingBottom: 120 + insets.bottom,
        }}
      >
        <RestaurantHeroCard
          restaurant={restaurant}
          favorite={favoriteRestaurantIds.includes(restaurant.id)}
          onBackPress={() => navigation.goBack()}
          onSharePress={() => { }}
          onFavoritePress={() => dispatch(toggleRestaurantFavorite(restaurant.id))}
        />

        <RestaurantTabs
          tabs={['Menu', 'Reviews', 'Info']}
          selectedTab={selectedTab}
          onChange={setSelectedTab}
        />

        {selectedTab === 'Menu' && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 10,
              }}
            >
              {menuFilters.map(filter => (
                <FilterChip
                  key={filter.id}
                  title={filter.title}
                  selected={selectedFilter === filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                />
              ))}
            </ScrollView>

            {menuSections.map(section => (
              <MenuSection
                key={section.id}
                category={section.title}
                items={section.items}
                onPress={food =>
                  navigation.navigate('FoodDetail', {
                    foodId: food.id,
                  })
                }
                onAddPress={handleAddToCart}
              />
            ))}
          </>
        )}

        {selectedTab === 'Reviews' && (
          <View>
            {restaurantReviews.length === 0 ? (
              <Text>No reviews yet</Text>
            ) : (
              restaurantReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </View>
        )}

        {selectedTab === 'Info' && (
          <>
            <RestaurantInfoSection restaurant={restaurant} />

            <RestaurantFeatureSection features={restaurant.features ?? []} />
          </>
        )}
      </ScrollView>

      <CartSummaryBar
        quantity={cartQuantity}
        total={cartTotal}
        bottom={insets.bottom}
        onPress={() => navigation.navigate('MainTabs', {
          screen: 'Cart',
        })}
      />
    </SafeAreaView>
  );
}
