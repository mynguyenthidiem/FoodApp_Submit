import { StyleSheet } from "react-native";
import { COLORS, FONT, SPACING, RADIUS, SHADOW } from "./theme";

const commonStyles = StyleSheet.create({

  // container
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingBottom: 120,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // BackHeader
  header: {
    flexDirection: "row",
    alignItems: "center",

    height: 60,

    paddingHorizontal: SPACING.lg,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,

    marginBottom: SPACING.lg,
  },

  headerContent: {
    flex: 1,
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: FONT.h4,
    fontWeight: "700",
    color: COLORS.primaryDark,
  },

  headerSubtitle: {
    marginTop: 2,

    fontSize: FONT.small,
    color: COLORS.neutral,
  },

  headerRightButton: {
    width: 40,
    height: 40,

    justifyContent: "center",
    alignItems: "center",
  },
  headerRightTextButton: {
    minWidth: 40,
    height: 40,

    justifyContent: "center",
    alignItems: "flex-end",
  },

  backButton: {
    width: 40,
    height: 40,

    justifyContent: "center",
    alignItems: "center",

    marginRight: SPACING.sm,
  },

  title: {
    fontSize: FONT.h1,
    fontWeight: '700',
    color: COLORS.heading,
  },

  subtitle: {
    fontSize: FONT.subtitle,
    color: COLORS.subtitle,
    marginBottom: SPACING.lg,
  },

  card: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    marginBottom: SPACING.sm,
    ...SHADOW,
  },

  button: {
    width: "100%",
    height: 55,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: COLORS.primary,

    borderRadius: RADIUS.pill,

    marginTop: SPACING.sm,

    ...SHADOW,
  },

  buttonText: {
    fontSize: FONT.subtitle,
    fontWeight: "bold",
    color: COLORS.white,
  },

  label: {
    alignSelf: "flex-start",
    fontSize: FONT.label,
    color: COLORS.text,
    marginBottom: 6,
  },

  link: {
    color: COLORS.primaryDark,
    fontWeight: "bold",
  },

  footerText: {
    color: COLORS.text,
    fontSize: FONT.small,
    lineHeight: FONT.small * 1.4,
  },

  orText: {
    textAlign: "center",
    color: COLORS.neutral,
    marginVertical: SPACING.xl,
  },

  // Bottom Navigation
  bottomTabBar: {
    height: 94,
    backgroundColor: COLORS.background,

    ...SHADOW,
  },

  activeIcon: {
    width: 46,
    height: 28,

    borderRadius: RADIUS.circle,

    backgroundColor: COLORS.primary,

    justifyContent: "center",
    alignItems: "center",

    ...SHADOW,
  },


});

export default commonStyles;