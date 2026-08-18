import { StyleSheet } from "react-native";
import { COLORS, FONT, SPACING, RADIUS, SHADOW } from "./theme";

const foodStyles = StyleSheet.create({

  // HERO

  heroImage: {
    width: "100%",
    height: 280,
  },

  content: {
    backgroundColor: COLORS.surface,
    marginTop: -24,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,

    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },

  // TITLE

  name: {
    marginTop: SPACING.sm,

    fontSize: FONT.h3,
    fontWeight: "700",

    color: COLORS.heading,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginTop: SPACING.md,
  },

  infoChip: {
    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,

    backgroundColor: COLORS.background,

    borderRadius: RADIUS.pill,

    ...SHADOW,
  },

  dot: {
    width: 4,
    height: 4,

    borderRadius: RADIUS.circle,

    marginHorizontal: SPACING.sm,

    backgroundColor: COLORS.placeholder,
  },

  infoText: {
    marginLeft: SPACING.xs,

    fontSize: FONT.small,
    fontWeight: "600",

    color: COLORS.heading,
  },

  // RESTAURANT

  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: SPACING.md,
  },

  restaurantName: {
    marginLeft: SPACING.sm,

    flex: 1,

    fontSize: FONT.body,
    fontWeight: "700",

    color: COLORS.heading,
  },

  categoryRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: SPACING.sm,
  },

  categoryText: {
    marginLeft: SPACING.sm,

    flex: 1,

    fontSize: FONT.small,

    color: COLORS.text,
  },

  // PRICE

  priceRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  price: {
    fontSize: FONT.h2,
    fontWeight: "700",

    color: COLORS.primaryDark,
  },

  oldPrice: {
    marginLeft: SPACING.md,

    fontSize: FONT.body,

    color: COLORS.placeholder,

    textDecorationLine: "line-through",
  },

  // ==========================
  // DESCRIPTION
  // ==========================

  description: {
    marginTop: SPACING.sm,

    fontSize: FONT.body,

    lineHeight: 24,

    color: COLORS.text,
  },

  // ==========================
  // INFO CARD
  // ==========================

  infoCard: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: SPACING.xl,

    paddingVertical: SPACING.lg,

    backgroundColor: COLORS.background,

    borderRadius: RADIUS.lg,

    ...SHADOW,
  },

  infoItem: {
    flex: 1,

    alignItems: "center",
  },

  infoDivider: {
    width: 1,

    height: 54,

    backgroundColor: COLORS.divider,
  },

  infoLabel: {
    marginTop: SPACING.sm,

    fontSize: FONT.caption,

    color: COLORS.text,
  },

  infoValue: {
    marginTop: 2,

    fontSize: FONT.small,
    fontWeight: "700",

    color: COLORS.heading,
  },

  // ==========================
  // QUANTITY
  // ==========================

  quantityCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },

  qtyButton: {
    width: 44,
    height: 44,

    borderRadius: RADIUS.circle,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.secondary,
  },

  qtyNumber: {
    width: 60,

    textAlign: "center",

    fontSize: FONT.h4,
    fontWeight: "700",

    color: COLORS.heading,
  },

  // ==========================
  // SUMMARY
  // ==========================

  summaryCard: {
    padding: SPACING.lg,

    marginBottom: SPACING.xl,

    borderRadius: RADIUS.lg,

    backgroundColor: COLORS.background,

    ...SHADOW,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    marginBottom: SPACING.md,
  },

  summaryLabel: {
    fontSize: FONT.body,

    color: COLORS.text,
  },

  summaryValue: {
    fontSize: FONT.body,
    fontWeight: "600",

    color: COLORS.heading,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingTop: SPACING.md,

    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  totalLabel: {
    fontSize: FONT.subtitle,
    fontWeight: "700",

    color: COLORS.heading,
  },

  totalValue: {
    fontSize: FONT.subtitle,
    fontWeight: "700",

    color: COLORS.primaryDark,
  },
});

export default foodStyles;
