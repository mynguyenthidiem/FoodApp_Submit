import { StyleSheet } from 'react-native';
import { COLORS, FONT, SPACING, RADIUS, SHADOW } from './theme';

const homeStyles = StyleSheet.create({
  // HOME HEADER
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    marginBottom: SPACING.lg,
  },

  headerContent: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },

  locationText: {
    marginLeft: SPACING.xs,
    fontSize: FONT.small,
    color: COLORS.neutral,
    fontWeight: '500',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftContainer: {
    flex: 1,
  },

  appName: {
    fontSize: FONT.h2,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },

  notificationWrapper: {
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: 2,
    right:50,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },

  // SEARCH BAR

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  searchPressable: {
    flex: 1,
  },

  searchBar: {
    flex: 1,
    backgroundColor: COLORS.white,
    elevation: 0,
    borderRadius: RADIUS.lg,
  },

  searchInput: {
    fontSize: FONT.small,
  },

  filterButton: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.white,
  },

  //  BANNER

  bannerCard: {
    height: 180,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    ...SHADOW,
  },

  bannerImage: {
    borderRadius: RADIUS.xl,
  },

  bannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',

    paddingHorizontal: SPACING.xl,
  },

  bannerChip: {
    alignSelf: 'flex-start',

    backgroundColor: COLORS.primary,

    borderRadius: RADIUS.pill,

    marginBottom: SPACING.sm,

    height: SPACING.xxxl,
  },

  bannerChipText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: FONT.caption,
  },

  bannerTitle: {
    fontSize: FONT.h2,
    fontWeight: '900',
    color: COLORS.white,
  },

  bannerSubtitle: {
    marginTop: SPACING.xs,
    fontSize: FONT.label,
    color: COLORS.white,
  },

  //  SECTION HEADER

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },

  sectionTitle: {
    fontSize: FONT.subtitle,
    fontWeight: '700',
    color: COLORS.heading,
  },

  sectionButton: {
    fontSize: FONT.small,
    color: COLORS.primary,
    fontWeight: '400',
  },

  // Filter Chip
  filterContainer: {
    marginBottom: SPACING.xl,
  },

  filterChip: {
    paddingHorizontal: SPACING.lg,
    height: 36,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: RADIUS.pill,

    backgroundColor: COLORS.secondary,

    marginRight: SPACING.sm,
  },

  selectedFilterChip: {
    backgroundColor: COLORS.primary,
  },

  filterChipText: {
    fontSize: FONT.small,
    color: COLORS.text,
    fontWeight: '500',
  },

  selectedFilterChipText: {
    color: COLORS.brown,
    fontWeight: '600',
  },

  //  CATEGORY CARD

  categoryList: {
    marginBottom: SPACING.xl,
  },

  categoryCard: {
    width: 70,
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.circle,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  selectedCategoryIcon: {
    backgroundColor: COLORS.primary,
  },

  categoryText: {
    marginTop: SPACING.sm,
    fontSize: FONT.caption,
    color: COLORS.text,
    fontWeight: '500',
  },

  selectedCategoryText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  //  RESTAURANT CARD

  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  restaurantImage: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.md,
  },

  restaurantContent: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'space-between',
  },

  restaurantName: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.heading,
  },

  restaurantAddress: {
    fontSize: FONT.caption,
    color: COLORS.neutral,
  },

  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },

  infoText: {
    fontSize: FONT.caption,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    marginRight: SPACING.md,
  },

  // FOOD CARD

  foodCard: {
    width: 160,
    height: 220,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginRight: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },

  foodImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },

  foodName: {
    fontSize: FONT.label,
    fontWeight: '700',
    color: COLORS.heading,
    marginBottom: SPACING.xs,
  },

  foodPrice: {
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.primary,
  },

  foodImageContainer: {
    position: 'relative',
  },

  favoriteButton: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,

    width: 34,
    height: 34,

    borderRadius: RADIUS.circle,

    backgroundColor: COLORS.white,

    justifyContent: 'center',
    alignItems: 'center',

    ...SHADOW,
  },
  foodBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginTop: SPACING.sm,
  },

  addButton: {
    width: 34,
    height: 34,

    borderRadius: RADIUS.circle,

    backgroundColor: COLORS.secondary,

    justifyContent: 'center',
    alignItems: 'center',
  },

  // CATEGORY SCREEN

  // Featured

  featuredCategoryCard: {
    width: '100%',
    height: 200,

    borderRadius: RADIUS.xl,
    overflow: 'hidden',

    marginBottom: SPACING.md,

    ...SHADOW,
  },

  featuredCategoryImage: {
    width: '100%',
    height: '100%',
  },

  featuredCategoryOverlay: {
    position: 'absolute',

    left: 0,
    right: 0,
    bottom: 0,

    height: '60%',

    justifyContent: 'flex-end',

    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    paddingTop: SPACING.xxxl,
  },

  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: COLORS.tertiary,

    marginBottom: SPACING.md,
  },

  featuredBadgeText: {
    color: COLORS.brown,
    fontSize: FONT.caption,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  featuredCategoryTitle: {
    color: COLORS.white,

    fontSize: FONT.h3,
    fontWeight: '700',

    marginBottom: SPACING.xs,
  },

  featuredCategorySubtitle: {
    color: COLORS.white,
    fontSize: FONT.body,

    marginTop: SPACING.xs,
  },

  // Row

  collectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginBottom: SPACING.lg,
  },

  // Collection

  collectionCard: {
    width: '48%',
    height: 200,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    ...SHADOW,
  },

  collectionGradient: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },

  collectionTitle: {
    fontSize: FONT.subtitle,
    fontWeight: '700',

    color: COLORS.brown,
  },

  collectionSubtitle: {
    marginTop: SPACING.xs,

    fontSize: FONT.caption,
    color: COLORS.text,
  },

  collectionImage: {
    width: '70%',
    height: 60,
    alignSelf: 'flex-end',
  },

  // Search screen
  searchSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  clearText: { fontSize: FONT.small, color: COLORS.primary, fontWeight: '600' },
  recentContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  emptySearchText: {
    textAlign: 'center',
    color: COLORS.neutral,
    fontSize: FONT.body,
    marginVertical: SPACING.xl,
  },
});

export default homeStyles;
