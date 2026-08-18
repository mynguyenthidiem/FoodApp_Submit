import React from "react";
import { View, Text } from "react-native";
import { Avatar } from "react-native-paper";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import restaurantStyles from "../styles/restaurant";
import { COLORS } from "../styles/theme";
import { resolveImage } from "../utils/imageUrl";

function formatReviewDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ReviewCard({
  review
}) {
  return (
    <View style={restaurantStyles.reviewCard}>

      <View style={restaurantStyles.reviewHeader}>
        <Avatar.Image
          size={42}
          source={resolveImage(review.userAvatar)}
        />
        <Text
          style={restaurantStyles.reviewAuthor}
        >
          {review.userName}
        </Text>

        <View
          style={restaurantStyles.reviewRating}
        >
          <MaterialCommunityIcons
            name="star"
            size={16}
            color={COLORS.warning}
          />

          <Text
            style={
              restaurantStyles.reviewRatingText
            }
          >
            {review.rating}
          </Text>
        </View>

      </View>

      <Text
        style={restaurantStyles.reviewComment}
      >
        {review.comment}
      </Text>

      <Text
        style={restaurantStyles.reviewDate}
      >
        {formatReviewDate(review.createdAt)}
      </Text>

    </View>
  );
}