import { StyleSheet } from "react-native";
import { COLORS, FONT, SPACING, RADIUS, SHADOW, SHADOW_SOFT } from "./theme";

const favoriteStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.circle,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.secondary,
  },

  headerTitle: {
    fontSize: FONT.h3,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationText: {
    marginLeft: 4,
    fontSize: FONT.small,
    fontWeight: "600",
    color: COLORS.text,
  },

  tabBar: {
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    padding: 4,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  tabButton: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
  },

  tabButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOW_SOFT,
  },

  tabText: {
    fontSize: FONT.label,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  tabTextActive: {
    color: COLORS.white,
  },

  grid: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },

  row: {
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  cardImageWrapper: {
    position: "relative",
  },

  cardImage: {
    width: "100%",
    height: 110,
    borderRadius: RADIUS.md,
  },

  heartButton: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,

    width: 32,
    height: 32,
    borderRadius: RADIUS.circle,

    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",

    ...SHADOW_SOFT,
  },

  statusBadge: {
    position: "absolute",
    bottom: SPACING.xs,
    left: SPACING.xs,

    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,

    backgroundColor: COLORS.overlayBlackDark,
  },

  statusBadgeText: {
    fontSize: FONT.caption,
    fontWeight: "700",
    color: COLORS.white,
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",

    marginTop: SPACING.sm,
  },

  cardName: {
    flex: 1,
    fontSize: FONT.label,
    fontWeight: "800",
    color: COLORS.brown,
    marginRight: SPACING.xs,
  },

  cardPrice: {
    fontSize: FONT.label,
    fontWeight: "800",
    color: COLORS.primary,
  },

  cardDescription: {
    marginTop: 2,
    fontSize: FONT.caption,
    color: COLORS.text,
  },

  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,

    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.pill,
  },

  addToCartText: {
    marginLeft: 6,
    fontSize: FONT.caption,
    fontWeight: "700",
    color: COLORS.white,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: SPACING.xl,
  },

  emptyTitle: {
    marginTop: SPACING.md,
    fontSize: FONT.subtitle,
    fontWeight: "700",
    color: COLORS.heading,
  },

  emptyText: {
    marginTop: SPACING.xs,
    textAlign: "center",
    fontSize: FONT.small,
    color: COLORS.neutral,
  },
});

export default favoriteStyles;