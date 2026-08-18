import {
  TouchableOpacity,
  View,
  Text,
  Image,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";

import homeStyles from "../styles/home";
import { COLORS } from "../styles/theme";
import { resolveImage } from '../utils/imageUrl';

export default function CollectionCard({ item, onPress, featured = false, }) {
  return (
    <TouchableOpacity
      style={[
        homeStyles.collectionCard,
        featured &&
        homeStyles.featuredCollectionCard,
      ]}
      onPress={onPress}
    >
      <LinearGradient
        colors={[
          COLORS.secondary,
          COLORS.background,
          COLORS.surface,
        ]}
        locations={[0, 0.9, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={homeStyles.collectionGradient}
      >
        <View style={homeStyles.collectionContent}>
          <Text style={homeStyles.collectionTitle}>
            {item.name}
          </Text>

          <Text style={homeStyles.collectionSubtitle}>
            {item.subtitle}
          </Text>
        </View>

        <Image
          source={resolveImage(item.image)}
          style={homeStyles.collectionImage}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
}