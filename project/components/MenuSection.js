import React from "react";
import { View } from "react-native";

import RestaurantSectionTitle from "./RestaurantSectionTitle";
import MenuItemCard from "./MenuItemCard";
import DrinkItemCard from "./DrinkItemCard";

export default function MenuSection({
    category,
    items,
    onPress,
    onAddPress,
}) {

    if (!items.length) return null;

    return (
        <View>

            <RestaurantSectionTitle
                title={category}
            />

            {items.map(item =>

                item.category === "drinks"

                    ?

                    <DrinkItemCard
                        key={item.id}
                        item={item}
                        onPress={() => onPress?.(item)}
                        onAddPress={() => onAddPress(item)}
                    />

                    :

                    <MenuItemCard
                        key={item.id}
                        item={item}
                        onPress={() => onPress?.(item)}
                        onAddPress={() => onAddPress(item)}
                    />

            )}

        </View>
    );
}