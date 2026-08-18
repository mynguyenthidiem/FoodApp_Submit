import { StyleSheet } from "react-native";
import { COLORS, FONT, SPACING, RADIUS, SHADOW_SOFT } from "./theme";

const notificationStyles = StyleSheet.create({

  // Header "Mark all as read" text action
  markAllText: {
    fontSize: FONT.small,
    fontWeight: "700",
    color: COLORS.primary,
  },

  markAllTextDisabled: {
    color: COLORS.placeholder,
  },

  // Notification bell badge (used on HomeHeader)
  badgeDot: {
    position: "absolute",
    top: 6,
    right: 6,

    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,

    borderRadius: RADIUS.circle,

    backgroundColor: COLORS.error,

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1.5,
    borderColor: COLORS.background,
  },

  badgeDotText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },

  // List
  listContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: 120,
  },

  separator: {
    height: SPACING.md,
  },

  footerLoading: {
    paddingVertical: SPACING.xl,
  },

  // Section header ("New" / "Earlier")
  sectionLabel: {
    fontSize: FONT.label,
    fontWeight: "700",
    color: COLORS.heading,

    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: SPACING.xxl,
    paddingTop: 80,
  },

  emptyIconWrap: {
    width: 88,
    height: 88,

    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.secondary,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: SPACING.xl,
  },

  emptyTitle: {
    fontSize: FONT.subtitle,
    fontWeight: "700",
    color: COLORS.heading,

    marginBottom: SPACING.xs,
  },

  emptyText: {
    fontSize: FONT.label,
    color: COLORS.neutral,
    textAlign: "center",
    lineHeight: FONT.label * 1.5,
  },

  // NotificationCard
  card: {
    flexDirection: "row",

    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,

    borderWidth: 1,
    borderColor: COLORS.border,

    padding: SPACING.md,

    ...SHADOW_SOFT,
  },

  cardUnread: {
    backgroundColor: COLORS.surfaceContainerLow,
    borderColor: COLORS.surfaceContainerLow,

    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },

  iconWrap: {
    width: 44,
    height: 44,

    borderRadius: RADIUS.circle,

    justifyContent: "center",
    alignItems: "center",

    marginRight: SPACING.md,
  },

  cardBody: {
    flex: 1,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: SPACING.sm,
  },

  cardTitle: {
    fontSize: FONT.label,
    fontWeight: "700",
    color: COLORS.heading,
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.primary,

    marginLeft: SPACING.xs,
  },

  cardTime: {
    fontSize: FONT.caption,
    color: COLORS.placeholder,
  },

  cardMessage: {
    marginTop: 3,

    fontSize: FONT.small,
    color: COLORS.text,
    lineHeight: FONT.small * 1.4,
  },

  // Pill action button ("Track Order" / "Rate Order")
  actionButton: {
    alignSelf: "flex-start",

    marginTop: SPACING.sm,

    paddingHorizontal: SPACING.lg,
    paddingVertical: 6,

    borderRadius: RADIUS.pill,

    borderWidth: 1,
    borderColor: COLORS.primaryLight,

    backgroundColor: COLORS.secondary,
  },

  actionButtonText: {
    fontSize: FONT.small,
    fontWeight: "600",
    color: COLORS.primaryDark,
  },
});

export default notificationStyles;