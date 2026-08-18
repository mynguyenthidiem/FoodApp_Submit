import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOW, SHADOW_SOFT } from './theme';
const AVATAR_SIZE = 50;

const styles = StyleSheet.create({

    profileCardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xl,
        borderRadius: RADIUS.xl,
        borderWidth: 2,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surfaceContainerLow,
    },
    profileInfo: {
        flex: 1,
        paddingLeft: SPACING.xl,
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        backgroundColor: COLORS.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.heading,
    },
    email: {
        fontSize: 16,
        color: COLORS.text,
        marginTop: 2,
    },
    editButton: {
        position: 'absolute',
        right: SPACING.md,
    },

    // settings row styles
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 5,
    },
    icon: {
        textAlign: 'center',
        lineHeight: 40,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.xl,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.border,
    },
    label: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold ',
        paddingLeft: SPACING.md,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    // setting screen
    divider: {
        marginTop: SPACING.xxl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginVertical: SPACING.md,
    },
    settingsRow: {
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: COLORS.border,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
    },
    signOutButton: {
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.xl,
        marginTop: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signOutText: {
        color: COLORS.error,
        fontSize: 18,
        paddingLeft: SPACING.md,
    },
    // edit profile screen
    avatarEditContainer: {
        width: 200,
        height: 200,
        alignSelf: "center",
        marginBottom: SPACING.xxl,
        position: "relative",
    },
    editAvatarWrapper: {
        width: "100%",
        height: "100%",
        borderRadius: ' 50%',
        borderWidth: 5,
        borderColor: COLORS.primaryDark,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    editAvatarImage: {
        width: "100%",
        height: "100%",
    },
    editForm: {
        backgroundColor: COLORS.secondary,
        padding: SPACING.xl,
        borderRadius: 10,
        marginBottom: SPACING.xl,
    },
    editFormLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: SPACING.sm,
    },
    editFormInput: {
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        borderRadius: 10,
        color: COLORS.text,
        paddingLeft: SPACING.xl,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: RADIUS.xl,
        marginBottom: SPACING.xl,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 18,
        paddingLeft: SPACING.md,
    },

    accountManagement: {
        fontSize: 16,
        fontWeight: "bold",
        color: COLORS.text,
        marginTop: SPACING.md,
        borderTopWidth: 2,
        borderTopColor: COLORS.border,
        paddingTop: SPACING.md,
    },
    deleteAccountButton: {
        flexDirection: "row",
        alignItems: "center", marginTop: SPACING.md
    },
    deleteAccountText: {
        color: COLORS.error,
        fontSize: 14,
        paddingLeft: SPACING.sm,
    },

    // profile screen
    header: {
        alignItems: "center",
        marginBottom: SPACING.l,
        justifyContent: "center",
    },
    avatarContainer: {
        width: 100,
        height: 100,
        alignSelf: "center",
        marginBottom: SPACING.xxl,
        position: "relative",
    },

    profileAvatarWrapper: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        borderWidth: 5,
        borderColor: COLORS.primaryDark,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },

    profileScreenAvatar: {
        width: "100%",
        height: "100%",
        borderWidth: 3,
        borderColor: '#fff',
        borderRadius: 50,
    },

    editAvatarButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primaryDark,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: COLORS.white,

        zIndex: 10,
        elevation: 5,
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: RADIUS.xl,
        paddingVertical: SPACING.lg,
        marginTop: SPACING.md,
        marginBottom: SPACING.xxl,
        gap: SPACING.sm,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
        marginHorizontal: SPACING.sm,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.lg,
        ...SHADOW_SOFT,
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primaryDark,
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: COLORS.neutral,
        marginTop: 2,
        letterSpacing: 0.5,
    },
    logoutButton: {
        backgroundColor: COLORS.secondary,
        paddingVertical: SPACING.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.xl,
        marginTop: SPACING.xl,
    },
    logoutText: {
        color: COLORS.error,
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: SPACING.md,
    },
});

export default styles;