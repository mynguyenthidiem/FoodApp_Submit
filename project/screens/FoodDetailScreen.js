import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import homeStyles from "../styles/home";
import commonStyles from "../styles/common";
import foodDetailStyles from "../styles/food";

import RestaurantActionBar from "../components/RestaurantActionBar";
import RestaurantBadge from "../components/RestaurantBadge";
import RestaurantSectionTitle from "../components/RestaurantSectionTitle";
import CustomButton from "../components/CustomButton";

import { COLORS } from "../styles/theme";
import { resolveImage } from "../utils/imageUrl";
import {
  fetchFoodById,
  fetchFoodsByCategory,
  clearFoodDetail,
} from "../store/foodSlice";
import { toggleFavorite } from "../store/favoriteSlice";
import { addCartItem } from "../store/cartSlice";
import {
  fetchRestaurantById,
  clearRestaurantDetail,
} from "../store/restaurantSlice";

export default function FoodDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const { food, relatedFoods, status, error } = useSelector(
    (state) => state.food
  );

  const { restaurant } = useSelector(
    (state) => state.restaurant
  );

  const { foodId } = route.params || {};

  const favoriteIds = useSelector(
    (state) => state.favorite.items
  );

  const favorite = favoriteIds.includes(foodId);

  const [quantity, setQuantity] = useState(1);


  const totalPrice = useMemo(() => {
    return Number(food?.price ?? 0) * quantity;
  }, [food, quantity]);

  useEffect(() => {
    if (!foodId) return;

    dispatch(fetchFoodById(foodId));

    return () => {
      dispatch(clearFoodDetail());
    };
  }, [dispatch, foodId]);

  useEffect(() => {
    if (!food?.categoryId) return;

    dispatch(
      fetchFoodsByCategory({
        categoryId: food.categoryId,
        pageNumber: 1,
        pageSize: 10,
      })
    );
  }, [dispatch, food?.categoryId]);

  useEffect(() => {
    if (!food?.restaurantId) return;

    dispatch(fetchRestaurantById(food.restaurantId));

    return () => {
      dispatch(clearRestaurantDetail());
    };
  }, [dispatch, food?.restaurantId]);

  useEffect(() => {
    setQuantity(1);
  }, [foodId]);


  useEffect(() => {
    console.log("foodId:", foodId);
    console.log("status:", status);
    console.log("food:", food);
  }, [foodId, status, food]);


  if (status === "loading" && !food) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={[commonStyles.centerContainer, { flex: 1 }]}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text style={{ marginTop: 12 }}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "failed") {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={[commonStyles.centerContainer, { flex: 1 }]}>
          <Text>
            {error ?? "Unable to load food."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!food) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={[commonStyles.centerContainer, { flex: 1 }]}>
          <Text>Food not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.screen} edges={["bottom"]}>
      <RestaurantActionBar
        top={insets.top}
        favorite={favorite}
        onBackPress={() => navigation.goBack()}
        onFavoritePress={() => dispatch(toggleFavorite(food.id))}
        onSharePress={() => { }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Image
          source={resolveImage(food.image)}
          style={foodDetailStyles.heroImage}
          resizeMode="cover"
        />
        <View style={foodDetailStyles.content}>
          <RestaurantBadge
            text={
              restaurant
                ? restaurant.isActive
                  ? "Open"
                  : "Closed"
                : "Loading..."
            }
          />
          <Text style={foodDetailStyles.name}>{food.name}</Text>

          <View style={foodDetailStyles.infoRow}>
            <View style={foodDetailStyles.infoChip}>
              <MaterialCommunityIcons name="star" size={16} color="#FFC107" />

              <Text style={foodDetailStyles.infoText}>{restaurant?.rating}</Text>
            </View>

            <View style={foodDetailStyles.infoChip}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={COLORS.primary}
              />

              <Text style={foodDetailStyles.infoText}>
                {restaurant?.openTime && restaurant?.closeTime
                  ? `${restaurant.openTime.slice(0, 5)} - ${restaurant.closeTime.slice(0, 5)}`
                  : '--'}
              </Text>
            </View>

            <View style={foodDetailStyles.infoChip}>
              <MaterialCommunityIcons
                name="bike-fast"
                size={16}
                color={COLORS.primary}
              />

              <Text style={foodDetailStyles.infoText}>${restaurant?.deliveryFee}</Text>
            </View>
          </View>

          {!!restaurant && (
            <View style={foodDetailStyles.restaurantRow}>
              <MaterialCommunityIcons
                name="storefront-outline"
                size={18}
                color={COLORS.primary}
              />

              <Text style={foodDetailStyles.restaurantName}>
                {restaurant.name}
              </Text>
            </View>
          )}

          <View style={foodDetailStyles.categoryRow}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              size={18}
              color={COLORS.primary}
            />

            <Text style={foodDetailStyles.categoryText}>{restaurant?.address}</Text>
          </View>

          {!!food.categoryName && (
            <View style={foodDetailStyles.categoryRow}>
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={18}
                color={COLORS.primary}
              />

              <Text style={foodDetailStyles.categoryText}>
                {food.categoryName}
              </Text>
            </View>
          )}
          <View style={foodDetailStyles.priceRow}>
            <Text style={foodDetailStyles.price}>
              $ {Number(food.price || 0).toFixed(2)}
            </Text>
          </View>
          <RestaurantSectionTitle title="Description" />
          <Text style={foodDetailStyles.description}>
            {food.description || "No description available."}
          </Text>
          <View style={foodDetailStyles.infoCard}>
            <View style={foodDetailStyles.infoItem}>
              <MaterialCommunityIcons
                name="food"
                size={22}
                color={COLORS.primary}
              />
              <Text style={foodDetailStyles.infoLabel}>Category</Text>
              <Text style={foodDetailStyles.infoValue}>
                {food.categoryName ?? "N/A"}
              </Text>
            </View>
            <View style={foodDetailStyles.infoDivider} />
            <View style={foodDetailStyles.infoItem}>
              <MaterialCommunityIcons
                name="cash"
                size={22}
                color={COLORS.success}
              />
              <Text style={foodDetailStyles.infoLabel}>Price</Text>
              <Text style={foodDetailStyles.infoValue}>
                ${Number(food.price).toFixed(2)}
              </Text>
            </View>
          </View>
          <RestaurantSectionTitle title="Quantity" />
          <View style={foodDetailStyles.quantityCard}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))}
              style={foodDetailStyles.qtyButton}
            >
              <MaterialCommunityIcons
                name="minus"
                size={22}
                color={COLORS.primaryDark}
              />
            </TouchableOpacity>
            <Text style={foodDetailStyles.qtyNumber}> {quantity} </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setQuantity((prev) => prev + 1)}
              style={foodDetailStyles.qtyButton}
            >
              <MaterialCommunityIcons
                name="plus"
                size={22}
                color={COLORS.primaryDark}
              />
            </TouchableOpacity>
          </View>
          <View style={foodDetailStyles.summaryCard}>
            <View style={foodDetailStyles.summaryRow}>
              <Text style={foodDetailStyles.summaryLabel}> Item Price </Text>
              <Text style={foodDetailStyles.summaryValue}>
                {" "}
                ${Number(food.price || 0).toFixed(2)}{" "}
              </Text>
            </View>
            <View style={foodDetailStyles.summaryRow}>
              <Text style={foodDetailStyles.summaryLabel}> Quantity </Text>
              <Text style={foodDetailStyles.summaryValue}> {quantity}</Text>
            </View>
            <View style={foodDetailStyles.totalRow}>
              <Text style={foodDetailStyles.totalLabel}> Total </Text>
              <Text style={foodDetailStyles.totalValue}>
                {" "}
                ${totalPrice.toFixed(2)}{" "}
              </Text>
            </View>
          </View>
          <CustomButton
            title={`Add to Cart • $${totalPrice.toFixed(2)}`}
            onPress={async () => {
              await dispatch(
                addCartItem({
                  foodId: food.id,
                  quantity,
                }),
              );

              navigation.navigate("MainTabs", {
                screen: "Cart",
              });
            }}
          />
          {relatedFoods.length > 0 && (
            <>
              <RestaurantSectionTitle title="You may also like" />
              <FlatList
                horizontal
                data={relatedFoods}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={homeStyles.foodCard}
                    onPress={() =>
                      navigation.push("FoodDetail", {
                        foodId: item.id,
                      })
                    }
                  >
                    <View style={homeStyles.foodImageContainer}>
                      <Image
                        source={resolveImage(item.image)}
                        style={homeStyles.foodImage}
                      />

                      <TouchableOpacity
                        style={homeStyles.favoriteButton}
                        onPress={() => dispatch(toggleFavorite(item.id))}
                      >
                        <MaterialCommunityIcons
                          name={
                            favoriteIds.includes(item.id)
                              ? "heart"
                              : "heart-outline"
                          }
                          size={18}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>

                    <Text numberOfLines={1} style={homeStyles.foodName}>
                      {item.name}
                    </Text>

                    <View style={homeStyles.foodBottom}>
                      <Text style={homeStyles.foodPrice}>
                        $ {Number(item.price).toFixed(2)}
                      </Text>
                      <TouchableOpacity
                        style={homeStyles.addButton}
                        onPress={() => {
                          navigation.push("FoodDetail", {
                            foodId: item.id,
                          });
                        }}
                      >
                        <MaterialCommunityIcons
                          name="plus"
                          size={18}
                          color={COLORS.primaryDark}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
