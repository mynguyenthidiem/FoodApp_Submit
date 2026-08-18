import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import commonStyles from "../styles/common";
import favoriteStyles from "../styles/favorite";
import { COLORS } from "../styles/theme";
import { resolveImage } from "../utils/imageUrl";

import FavoriteFoodCard from "../components/FavoriteFoodCard";
import FavoriteRestaurantCard from "../components/FavoriteRestaurantCard";

import BackHeader from "../components/BackHeader";

import {
    fetchFavoriteFoods,
    fetchFavoriteRestaurants,
    toggleFavorite,
    toggleRestaurantFavorite,
} from "../store/favoriteSlice";
import { addCartItem } from "../store/cartSlice";
import { fetchCurrentUser } from "../store/userSlice";

const TABS = {
    FOODS: "foods",
    RESTAURANTS: "restaurants",
};

function TabButton({ label, active, onPress }) {
    return (
        <TouchableOpacity
            style={[favoriteStyles.tabButton, active && favoriteStyles.tabButtonActive]}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <Text style={[favoriteStyles.tabText, active && favoriteStyles.tabTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default function FavoritesScreen({ navigation }) {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState(TABS.FOODS);

    const { user: authUser } = useSelector(state => state.auth);
    const { currentUser } = useSelector(state => state.user);

    const {
        foods,
        foodsStatus,
        restaurants,
        restaurantsStatus,
    } = useSelector(state => state.favorite);

    useFocusEffect(
        useCallback(() => {
            if (authUser?.id) {
                dispatch(fetchCurrentUser(authUser.id));
            }
        }, [dispatch, authUser?.id]),
    );

    useFocusEffect(
        useCallback(() => {
            if (activeTab === TABS.FOODS) {
                dispatch(fetchFavoriteFoods({ pageNumber: 1, pageSize: 50 }));
            } else {
                dispatch(fetchFavoriteRestaurants({ pageNumber: 1, pageSize: 50 }));
            }
        }, [dispatch, activeTab]),
    );

    const handleRemoveFood = item => {
        dispatch(toggleFavorite(item.id));
    };

    const handleRemoveRestaurant = item => {
        dispatch(toggleRestaurantFavorite(item.id));
    };

    const handleAddToCart = item => {
        dispatch(addCartItem({ foodId: item.id, quantity: 1 }));
    };

    const isLoading =
        (activeTab === TABS.FOODS && foodsStatus === "loading") ||
        (activeTab === TABS.RESTAURANTS && restaurantsStatus === "loading");

    const data = activeTab === TABS.FOODS ? foods : restaurants;

    const renderEmpty = () => {
        if (isLoading) return null;

        return (
            <View style={favoriteStyles.emptyContainer}>
                <MaterialCommunityIcons
                    name="heart-outline"
                    size={64}
                    color={COLORS.neutral}
                />

                <Text style={favoriteStyles.emptyTitle}>
                    {activeTab === TABS.FOODS
                        ? "No favorite foods yet"
                        : "No favorite restaurants yet"}
                </Text>

                <Text style={favoriteStyles.emptyText}>
                    Tap the heart icon on any {activeTab === TABS.FOODS ? "dish" : "restaurant"} to save it here.
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={commonStyles.screen} edges={["top", "left", "right"]}>

            <BackHeader title="Favorites" />

            <View style={favoriteStyles.tabBar}>
                <TabButton
                    label="Foods"
                    active={activeTab === TABS.FOODS}
                    onPress={() => setActiveTab(TABS.FOODS)}
                />
                <TabButton
                    label="Restaurants"
                    active={activeTab === TABS.RESTAURANTS}
                    onPress={() => setActiveTab(TABS.RESTAURANTS)}
                />
            </View>

            {isLoading && data.length === 0 ? (
                <View style={favoriteStyles.emptyContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    key={activeTab}
                    data={data}
                    keyExtractor={item => `${activeTab}-${item.id}`}
                    numColumns={2}
                    columnWrapperStyle={favoriteStyles.row}
                    contentContainerStyle={favoriteStyles.grid}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    renderItem={({ item }) =>
                        activeTab === TABS.FOODS ? (
                            <FavoriteFoodCard
                                item={item}
                                onPress={food =>
                                    navigation.navigate("FoodDetail", { foodId: food.id })
                                }
                                onFavoritePress={handleRemoveFood}
                                onAddPress={handleAddToCart}
                            />
                        ) : (
                            <FavoriteRestaurantCard
                                item={item}
                                onPress={restaurant =>
                                    navigation.navigate("RestaurantDetail", {
                                        restaurantId: restaurant.id,
                                    })
                                }
                                onFavoritePress={handleRemoveRestaurant}
                            />
                        )
                    }
                />
            )}
        </SafeAreaView>
    );
}