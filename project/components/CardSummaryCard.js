import React from "react";
import { View, Text } from "react-native";

import commonStyles from "../styles/common";
import foodStyles from "../styles/food";

import CustomButton from "./CustomButton";

export default function CartSummaryCard({
  subtotal,
  deliveryFee,
  tax,
  total,
  onCheckout,
}) {
  return (
    <View style={commonStyles.card}>
      <View style={foodStyles.summaryRow}>
        <Text style={foodStyles.summaryLabel}>Subtotal</Text>

        <Text style={foodStyles.summaryValue}>${subtotal.toFixed(2)}</Text>
      </View>

      <View style={foodStyles.summaryRow}>
        <Text style={foodStyles.summaryLabel}>Delivery Fee</Text>

        <Text style={foodStyles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
      </View>

      <View style={foodStyles.summaryRow}>
        <Text style={foodStyles.summaryLabel}>Tax</Text>

        <Text style={foodStyles.summaryValue}>${tax.toFixed(2)}</Text>
      </View>

      <View style={foodStyles.totalRow}>
        <Text style={foodStyles.totalLabel}>Total</Text>

        <Text style={foodStyles.totalValue}>${total.toFixed(2)}</Text>
      </View>

      <CustomButton title="Proceed to Checkout" onPress={onCheckout} />
    </View>
  );
}
