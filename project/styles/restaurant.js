import { StyleSheet } from "react-native";
import { COLORS, FONT, SPACING, RADIUS, SHADOW } from "./theme";

const restaurantStyles = StyleSheet.create({
  // BADGE

  badgeContainer: {
    position: "absolute",
    top: SPACING.md,
    left: SPACING.md,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },

  badgeText: {
    color: COLORS.white,
    fontSize: FONT.caption,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  // RATING

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.secondary,
  },

  ratingText: {
    marginLeft: SPACING.xs,
    color: COLORS.brown,
    fontSize: FONT.caption,
    fontWeight: "700",
  },

  // TAG

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.secondary,
    marginRight: SPACING.sm,
    marginTop: SPACING.sm,
  },

  tagText: {
    color: COLORS.brown,
    fontSize: FONT.caption,
    fontWeight: "500",
  },

  // FAVORITE BUTTON

  favoriteButton: {
    position: "absolute",
    top: SPACING.md,
    right: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: RADIUS.circle,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    ...SHADOW,
  },

  // RESTAURANT CARD

  restaurantCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    overflow: "hidden",
    marginBottom: SPACING.xl,
    ...SHADOW,
  },

  imageContainer: {
    position: "relative",
  },

  restaurantImage: {
    width: "100%",
    height: 190,
  },

  content: {
    padding: SPACING.lg,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  restaurantName: {
    flex: 1,
    fontSize: FONT.h4,
    fontWeight: "700",
    color: COLORS.heading,
    marginRight: SPACING.md,
  },

  restaurantMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  infoText: {
    marginLeft: SPACING.xs,
    marginRight: SPACING.md,
    fontSize: FONT.small,
    color: COLORS.brown,
  },

  // RESTAURANT HERO

  heroCard: {
    marginBottom: SPACING.lg,
  },

  heroImage: {
    width: "100%",
    height: 320,
    borderRadius: RADIUS.lg,
  },

  heroContent: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: -30,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    ...SHADOW,
  },

  heroTitle: {
    flex: 1,
    fontSize: FONT.h1,
    fontWeight: "700",
    color: COLORS.heading,
    marginRight: SPACING.md,
  },

  heroCuisine: {
    marginTop: SPACING.sm,
    fontSize: FONT.body,
    color: COLORS.text,
  },

  heroInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.lg,
  },

  heroInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: SPACING.lg,
    marginBottom: SPACING.sm,
  },

  heroInfoText: {
    marginLeft: SPACING.xs,
    fontSize: FONT.small,
    color: COLORS.brown,
  },

  // MENU ITEM CARD

  menuItemCard: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.lg,
    ...SHADOW,
  },

  menuItemImage: {
    width: 90,
    height: "100%",
    // borderRadius: RADIUS.md,
    alignItems: "center",
  },

  menuItemContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: "space-between",
  },

  menuItemTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },

  menuItemName: {
    flex: 1,
    fontSize: FONT.subtitle,
    fontWeight: "700",
    color: COLORS.heading,
    marginRight: SPACING.md,
  },

  menuItemPrice: {
    fontSize: FONT.subtitle,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  menuItemDescription: {
    fontSize: FONT.small,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },

  addOrderButton: {
    height: 42,
    borderRadius: RADIUS.md,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
  },

  addOrderButtonText: {
    fontSize: FONT.label,
    fontWeight: "700",
    color: COLORS.brown,
  },

  // DRINK ITEM CARD

  drinkItemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  drinkImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginRight: 14,
    resizeMode: "cover",
  },
  drinkInfo: {
    flex: 1,
  },

  drinkName: {
    fontSize: FONT.label,
    fontWeight: "700",
    color: COLORS.heading,
  },

  drinkSize: {
    marginTop: SPACING.xs,
    fontSize: FONT.caption,
    color: COLORS.text,
  },

  drinkRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  drinkPrice: {
    fontSize: FONT.subtitle,
    fontWeight: "700",
    color: COLORS.primaryDark,
    marginRight: SPACING.md,
  },

  drinkAddButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.circle,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    ...SHADOW,
  },

  // CART SUMMARY BAR

  cartSummaryBar: {
    position: "absolute",
    left: SPACING.lg,
    right: SPACING.lg,
    height: 60,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    ...SHADOW,
  },

  cartQuantityBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryDark,
  },

  cartQuantityText: {
    color: COLORS.white,
    fontSize: FONT.body,
    fontWeight: "700",
  },

  cartTitle: {
    flex: 1,
    marginLeft: SPACING.md,
    color: COLORS.white,
    fontSize: FONT.subtitle,
    fontWeight: "700",
  },

  cartTotal: {
    color: COLORS.white,
    fontSize: FONT.subtitle,
    fontWeight: "700",
  },

  // TABS

  tabsContainer: {
    flexDirection: "row",
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingBottom: SPACING.md,
  },

  tabText: {
    fontSize: FONT.label,
    fontWeight: "600",
    color: COLORS.neutral,
  },

  selectedTabText: {
    color: COLORS.primaryDark,
  },

  tabIndicator: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 3,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },

  sectionTitle: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    fontSize: FONT.h3,
    fontWeight: "700",
    color: COLORS.heading,
  },

  // REVIEW CARD

  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  reviewAuthor: {
    flex: 1,
    marginLeft: SPACING.md,
    fontSize: FONT.label,
    fontWeight: "700",
    color: COLORS.heading,
  },

  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },

  reviewRatingText: {
    marginLeft: SPACING.xs,
    fontSize: FONT.small,
    fontWeight: "700",
    color: COLORS.heading,
  },

  reviewComment: {
    fontSize: FONT.body,
    color: COLORS.text,
    lineHeight: 22,
  },

  reviewDate: {
    marginTop: SPACING.sm,
    fontSize: FONT.caption,
    color: COLORS.neutral,
  },

  // RESTAURANT INFO SECTION

  infoSection: {
    marginTop: SPACING.xl,
  },

  infoSectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOW,
  },

  infoSectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.lg,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.circle,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    marginRight: SPACING.md,
  },

  infoContent: {
    flex: 1,
  },

  infoSectionTitle: {
    fontSize: FONT.label,
    fontWeight: "700",
    color: COLORS.heading,
    marginBottom: SPACING.xs,
  },

  infoValue: {
    fontSize: FONT.small,
    color: COLORS.text,
    lineHeight: 20,
  },

  // FEATURE SECTION

  featureSection: {
    marginTop: SPACING.xl,
  },

  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.sm,
  },

  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.secondary,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },

  featureChipText: {
    color: COLORS.brown,
    fontSize: FONT.caption,
    fontWeight: "600",
  },

  // ACTION BAR

  actionBar: {
    position: "absolute",
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 100,
  },

  actionRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },

  actionButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.circle,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    ...SHADOW,
  },
  // CART MODE

  cartControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.md,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyButton: {
    width: 36,
    height: 36,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: RADIUS.circle,

    backgroundColor: COLORS.secondary,
  },

  qtyText: {
    width: 42,
    textAlign: "center",

    fontSize: FONT.body,
    fontWeight: "700",

    color: COLORS.heading,
  },
});

export default restaurantStyles;
