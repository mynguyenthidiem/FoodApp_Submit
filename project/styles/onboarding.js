import { StyleSheet } from "react-native";
import { COLORS, FONT, SPACING, RADIUS, SHADOW } from "./theme";

const onboardingStyles = StyleSheet.create({
  // Splash Screen
  logoBox: {
    width: 90,
    height: 90,

    borderRadius: RADIUS.xxl,

    justifyContent: "center",
    alignItems: "center",

    alignSelf: "center",
    marginBottom: SPACING.xxl,

    ...SHADOW,
  },

  logoBoxPrimary: {
    backgroundColor: COLORS.primary,
  },

  logoBoxLight: {
    backgroundColor: COLORS.white,
  },

  logo: {
    fontSize: FONT.h2,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: SPACING.xxl,
  },
  
  slogan: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 2,
    marginTop: SPACING.sm,
  },

  description: {
    color: COLORS.white,
    textAlign: "center",
    fontStyle: "italic",
    fontSize: FONT.body,
    lineHeight: 24,
    marginTop: 30,
    opacity: 0.9,
  },

  loadingContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },

  loadingBar: {
    width: 140,
    height: 3,
    backgroundColor: COLORS.overlayWhite,
    borderRadius: 3,
    marginBottom: 10,
  },

  loadingText: {
    color: COLORS.white,
    fontSize: FONT.caption,
    letterSpacing: 1,
  },

  // Onboarding Card
  onboardCard: {
    width: "100%",
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.xxl,
    padding: 10,

    marginBottom: SPACING.xxl,

    ...SHADOW,
  },

  onboardImage: {
    width: "100%",
    height: 400,
    borderRadius: RADIUS.xl,
  },

  imageLabel: {
    position: "absolute",
    left: 20,
    bottom: 10,

    width: "95%",

    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    padding: 10,
  },

  smallTitle: {
    fontSize: FONT.body,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    textAlign: "center",
    marginBottom: 4,
  },

  smallDescription: {
    fontSize: FONT.caption,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 18,
  },

  // Onboarding Screen
  onboardTitle: {
    fontSize: FONT.h2,
    fontWeight: "bold",
    color: COLORS.primaryDark,
    marginBottom: SPACING.lg,
  },

  onboardDescription: {
    fontSize: 17,
    color: COLORS.text,
    textAlign: "center",
    lineHeight: 26,
    paddingHorizontal: 18,
    marginBottom: 35,
  },

  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.divider,
    marginHorizontal: 4,
  },

  activeDot: {
    width: 20,
    backgroundColor: COLORS.primary,
  },

  skipText: {
    marginTop: 18,
    color: COLORS.neutral,
    fontWeight: "600",
  },
});

export default onboardingStyles;