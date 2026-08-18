import { StyleSheet } from "react-native";
import { COLORS, FONT, SPACING, RADIUS } from "./theme";

const authStyles = StyleSheet.create({
  // Input
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",    

    backgroundColor: COLORS.background,

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: RADIUS.lg,

    paddingHorizontal: SPACING.lg,

    marginBottom: SPACING.lg,

    minHeight: 50,
  },
  input: {
    fontSize: FONT.body,
    color: COLORS.heading,

    paddingVertical: SPACING.md,
  },

  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: FONT.body,
    color: COLORS.heading,
  },

  // Password
  passwordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 6,
  },

  forgot: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },

  // Social Login
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  socialButton: {
    flex: 1,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    height: 50,

    marginHorizontal: 5,

    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: RADIUS.lg,

    backgroundColor: COLORS.surface,
  },

  socialText: {
    marginLeft: SPACING.sm,
    fontWeight: "600",
    color: COLORS.heading,
  },

  // Register
  registerContainer: {
    flexDirection: "row",
    marginTop: SPACING.sm,
  },

  // Checkbox
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",

    marginVertical: SPACING.sm,
  },

  checkbox: {
    width: 18,
    height: 18,

    justifyContent: "center",
    alignItems: "center",

    marginRight: SPACING.sm,

    borderWidth: 1,
    borderColor: COLORS.placeholder,
  },
});

export default authStyles;