import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { useDispatch, useSelector } from "react-redux";

import commonStyles from "../styles/common";
import orderStyles from "../styles/order";
import foodStyles from "../styles/food";
import restaurantStyles from "../styles/restaurant";

import SectionHeader from "../components/SectionHeader";
import MenuItemCard from "../components/MenuItemCard";
import CustomButton from "../components/CustomButton";

import { COLORS } from "../styles/theme";

import { fetchCart, updateCartItem, removeCartItem } from "../store/cartSlice";

import { fetchFoodById } from "../store/foodSlice";

import { fetchRestaurantById } from "../store/restaurantSlice";

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();

  const { items, status, error } = useSelector((state) => state.cart);

  const { food } = useSelector((state) => state.food);

  const { restaurant } = useSelector((state) => state.restaurant);

  // Load cart

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Load first food

  useEffect(() => {
    if (items.length === 0) return;

    dispatch(fetchFoodById(items[0].foodId));
  }, [dispatch, items]);

  // Load restaurant

  useEffect(() => {
    if (!food?.restaurantId) return;

    dispatch(fetchRestaurantById(food.restaurantId));
  }, [dispatch, food?.restaurantId]);

  // Summary

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
  }, [items]);

  const deliveryFee = Number(restaurant?.deliveryFee) || 0;

  const tax = subtotal * 0.1;

  const total = subtotal + deliveryFee + tax;

  const handleIncrease = (item) => {
    dispatch(
      updateCartItem({
        id: item.id,
        quantity: item.quantity + 1,
      }),
    );
  };

  const handleDecrease = (item) => {
    if (item.quantity <= 1) {
      dispatch(removeCartItem(item.id));
      return;
    }

    dispatch(
      updateCartItem({
        id: item.id,
        quantity: item.quantity - 1,
      }),
    );
  };

  const handleRemove = (id) => {
    dispatch(removeCartItem(id));
  };

  if (status === "loading" && items.length === 0) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={orderStyles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />

          <Text style={{ marginTop: 12 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "failed" && items.length === 0) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={[commonStyles.centerContainer, { flex: 1 }]}>
          <Text>{error ?? "Unable to load cart."}</Text>
        </View>
      </SafeAreaView>
    );
  }
  if (items.length === 0) {
    return (
      <SafeAreaView style={commonStyles.screen}>
        <View style={[commonStyles.centerContainer, { flex: 1 }]}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={80}
            color={COLORS.neutral}
          />

          <Text style={orderStyles.emptyTitle}>Your cart is empty</Text>

          <Text style={orderStyles.emptyText}>
            Browse restaurants and add your favorite dishes.
          </Text>

          <CustomButton
            title="Start Ordering"
            onPress={() => navigation.navigate("Home")}
          />
        </View>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }) => (
    <MenuItemCard
      item={{
        name: item.foodName,
        price: item.price,
        image: item.image,
      }}
      cartMode
      quantity={item.quantity}
      onIncrease={() => handleIncrease(item)}
      onDecrease={() => handleDecrease(item)}
      onRemove={() => handleRemove(item.id)}
    />
  );

  return (
    <SafeAreaView style={commonStyles.screen}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={commonStyles.scrollContainer}
        ListHeaderComponent={
          <>
            <SectionHeader
              title="Your Basket"
            />

            {restaurant && (
              <View style={restaurantStyles.contentContainer}>
                <View style={restaurantStyles.restaurantMetaRow}>
                  <MaterialCommunityIcons
                    name="storefront-outline"
                    size={20}
                    color={COLORS.primary}
                  />

                  <Text style={restaurantStyles.restaurantName}>
                    {restaurant.name}
                  </Text>
                </View>
              </View>
            )}
          </>
        }
        ListFooterComponent={
          <>
            <View style={foodStyles.summaryCard}>
              <View style={foodStyles.summaryRow}>
                <Text style={foodStyles.summaryLabel}>Subtotal</Text>

                <Text style={foodStyles.summaryValue}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>

              <View style={foodStyles.summaryRow}>
                <Text style={foodStyles.summaryLabel}>Delivery Fee</Text>

                <Text style={foodStyles.summaryValue}>
                  ${deliveryFee.toFixed(2)}
                </Text>
              </View>

              <View style={foodStyles.summaryRow}>
                <Text style={foodStyles.summaryLabel}>Tax</Text>

                <Text style={foodStyles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>

              <View style={foodStyles.totalRow}>
                <Text style={foodStyles.totalLabel}>Total</Text>

                <Text style={foodStyles.totalValue}>${total.toFixed(2)}</Text>
              </View>

              <CustomButton
                title="Proceed to Checkout"
                onPress={() => navigation.navigate("Checkout")}
              />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}
