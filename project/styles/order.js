import { StyleSheet } from 'react-native';
import { COLORS, FONT, SPACING, RADIUS, SHADOW } from './theme';

const orderStyles = StyleSheet.create({
  // Cart Item

  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: SPACING.md,

    marginBottom: SPACING.md,

    borderRadius: RADIUS.lg,

    backgroundColor: COLORS.surface,

    ...SHADOW,
  },

  cartImage: {
    width: 90,
    height: 90,

    borderRadius: RADIUS.md,
  },

  cartContent: {
    flex: 1,

    marginLeft: SPACING.md,
  },

  cartTitle: {
    fontSize: FONT.label,
    fontWeight: '700',

    color: COLORS.heading,
  },

  cartPrice: {
    fontSize: FONT.subtitle,
    fontWeight: '700',

    color: COLORS.primaryDark,
  },

  //quantity
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  qtyText: {
    width: 42,
    textAlign: 'center',
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.heading,
  },

  // Empty

  emptyContainer: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: SPACING.xxxl,
  },

  emptyTitle: {
    marginTop: SPACING.xl,

    fontSize: FONT.h3,
    fontWeight: '700',

    color: COLORS.heading,
  },

  emptyText: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontSize: FONT.body,
    lineHeight: 24,
    color: COLORS.text,
  },

  // Checkout

  checkoutSection: {
    marginBottom: SPACING.lg,
  },

  checkoutSectionTitle: {
    fontSize: FONT.subtitle,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: SPACING.md,
  },

  checkoutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW,
  },

  // Address

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  addressIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  addressContent: {
    flex: 1,
  },

  addressName: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.heading,
  },

  addressText: {
    marginTop: SPACING.xs,
    fontSize: FONT.small,
    lineHeight: 20,
    color: COLORS.text,
  },

  changeButton: {
    marginTop: SPACING.md,
    alignSelf: 'flex-end',
  },

  changeButtonText: {
    fontSize: FONT.small,
    fontWeight: '700',
    color: COLORS.primary,
  },

  // Payment

  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },

  paymentOptionLast: {
    borderBottomWidth: 0,
  },

  paymentIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  paymentContent: {
    flex: 1,
  },

  paymentTitle: {
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.heading,
  },

  paymentSubtitle: {
    marginTop: 2,
    fontSize: FONT.caption,
    color: COLORS.neutral,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.circle,
    borderWidth: 2,
    borderColor: COLORS.divider,
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioOuterSelected: {
    borderColor: COLORS.primary,
  },

  radioInner: {
    width: 11,
    height: 11,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primary,
  },

  // Checkout Items

  checkoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  checkoutItemImage: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
  },

  checkoutImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },

  checkoutItemContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  checkoutItemName: {
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.heading,
  },

  checkoutItemQuantity: {
    marginTop: SPACING.xs,
    fontSize: FONT.caption,
    color: COLORS.neutral,
  },

  checkoutItemPrice: {
    fontSize: FONT.small,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  // Checkout Summary

  checkoutSummary: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  checkoutSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },

  checkoutSummaryLabel: {
    fontSize: FONT.small,
    color: COLORS.text,
  },

  checkoutSummaryValue: {
    fontSize: FONT.small,
    fontWeight: '600',
    color: COLORS.heading,
  },

  checkoutTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  checkoutTotalLabel: {
    fontSize: FONT.subtitle,
    fontWeight: '700',
    color: COLORS.heading,
  },

  checkoutTotalValue: {
    fontSize: FONT.h3,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  // Checkout Button

  checkoutButtonContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },

  // Error

  errorText: {
    marginTop: SPACING.sm,
    fontSize: FONT.small,
    color: COLORS.error,
  },

  // Empty Checkout

  emptyCheckout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  // ============================================================
  // PAYMENT SCREEN
  // ============================================================

  // Payment header
  paymentHeaderContainer: {
    marginBottom: SPACING.md,
  },

  // Payment method selected card
  paymentOptionSelected: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },

  // Payment summary
  paymentSummaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOW,
  },

  paymentSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  paymentSummaryLabel: {
    fontSize: FONT.small,
    color: COLORS.text,
  },

  paymentSummaryValue: {
    fontSize: FONT.small,
    fontWeight: '600',
    color: COLORS.heading,
  },

  paymentSummaryDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },

  paymentSummaryTotal: {
    fontSize: FONT.h3,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  // Payment information
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },

  paymentInfoIcon: {
    marginRight: SPACING.md,
  },

  paymentInfoContent: {
    flex: 1,
  },

  paymentInfoTitle: {
    fontSize: FONT.small,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: SPACING.xs,
  },

  paymentInfoText: {
    fontSize: FONT.caption,
    color: COLORS.text,
    lineHeight: 19,
  },

  // Bottom payment action
  paymentBottomContainer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },

  paymentBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  paymentBottomLabel: {
    fontSize: FONT.small,
    color: COLORS.neutral,
  },

  paymentBottomValue: {
    fontSize: FONT.h3,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  paymentLoadingButton: {
    opacity: 0.6,
  },

  paymentSuccessIcon: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  // order success screen
  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',

    paddingHorizontal: SPACING.md,
    paddingVertical: 6,

    borderRadius: RADIUS.pill,

    backgroundColor: COLORS.tertiary,

    marginBottom: SPACING.md,
  },

  confirmedBadgeText: {
    marginLeft: SPACING.xs,

    fontSize: FONT.small,
    fontWeight: '700',
    color: COLORS.white,
  },

  secondaryButton: {
    width: '100%',
    height: 55,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: COLORS.secondary,

    borderRadius: RADIUS.pill,

    marginTop: SPACING.md,
  },

  secondaryButtonText: {
    fontSize: FONT.subtitle,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  // my order screen
  ordersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },

  ordersAvatar: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.circle,
    marginRight: SPACING.md,
  },

  ordersHeaderTitle: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  ordersTabContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.pill,
    padding: 4,
  },

  ordersTab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADIUS.pill,
  },

  ordersTabActive: {
    backgroundColor: COLORS.primary,
  },

  ordersTabText: {
    fontSize: FONT.small,
    color: COLORS.text,
    fontWeight: '600',
  },

  ordersTabTextActive: {
    color: COLORS.white,
  },

  ordersListContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  orderListCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  orderListTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderListImage: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
  },

  orderListInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },

  orderListRestaurant: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.heading,
  },

  orderListMeta: {
    fontSize: FONT.caption,
    color: COLORS.neutral,
    marginTop: 2,
  },
  orderListIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  orderStatusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },

  orderStatusText: {
    fontSize: FONT.caption,
    color: COLORS.white,
    fontWeight: '600',
  },

  orderListDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: SPACING.sm,
  },

  orderListBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderEstimatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderEstimatedText: {
    marginLeft: SPACING.xs,
    fontSize: FONT.small,
    color: COLORS.text,
  },

  orderTrackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  orderTrackText: {
    fontSize: FONT.small,
    color: COLORS.primary,
    fontWeight: '600',
  },

  ordersEmptyContainer: {
    alignItems: 'center',
    marginTop: 64,
  },

  ordersEmptyText: {
    marginTop: SPACING.md,
    fontSize: FONT.body,
    color: COLORS.neutral,
  },
});

export default orderStyles;
