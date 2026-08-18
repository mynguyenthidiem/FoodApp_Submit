import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Text, SectionList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BackHeader from '../components/BackHeader';
import NotificationCard from '../components/NotificationCard';

import commonStyles from '../styles/common';
import notificationStyles from '../styles/notification';
import { COLORS } from '../styles/theme';

import {
  fetchNotifications,
  fetchUnreadCount,
  markAsReadAsync,
  markAllAsReadAsync,
} from '../store/notificationSlice';

const PAGE_SIZE = 20;

export default function NotificationScreen({ navigation }) {
  const dispatch = useDispatch();

  const {
    items,
    status,
    loadMoreStatus,
    hasMore,
    pageNumber,
    unreadCount,
  } = useSelector(state => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications({ pageNumber: 1, pageSize: PAGE_SIZE, refresh: true }));
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const sections = useMemo(() => {
    const unread = items.filter(item => !item.isRead);
    const read = items.filter(item => item.isRead);

    const result = [];
    if (unread.length > 0) result.push({ title: 'New', data: unread });
    if (read.length > 0) result.push({ title: 'Earlier', data: read });

    return result;
  }, [items]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchNotifications({ pageNumber: 1, pageSize: PAGE_SIZE, refresh: true }));
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!hasMore || status === 'loading' || loadMoreStatus === 'loading') return;

    dispatch(
      fetchNotifications({ pageNumber: pageNumber + 1, pageSize: PAGE_SIZE }),
    );
  }, [dispatch, hasMore, pageNumber, status, loadMoreStatus]);

  const handleMarkAllAsRead = useCallback(() => {
    if (unreadCount === 0) return;

    dispatch(markAllAsReadAsync());
  }, [dispatch, unreadCount]);

  const handlePressNotification = useCallback(
    notification => {
      if (!notification.isRead) {
        dispatch(markAsReadAsync(notification.id));
      }
    },
    [dispatch],
  );

  const handleActionPress = useCallback(
    (notification) => {
      if (!notification.isRead) {
        dispatch(markAsReadAsync(notification.id));
      }
      if (notification.type === 0 || notification.type === 1) {
        navigation.navigate('MainTabs', { screen: 'Orders' });
      }
    },
    [dispatch, navigation],
  );

  const renderEmpty = () => {
    if (status === 'loading') return null;

    return (
      <View style={notificationStyles.emptyContainer}>
        <View style={notificationStyles.emptyIconWrap}>
          <MaterialCommunityIcons
            name="bell-off-outline"
            size={40}
            color={COLORS.primaryDark}
          />
        </View>

        <Text style={notificationStyles.emptyTitle}>No notifications yet</Text>
        <Text style={notificationStyles.emptyText}>
          We'll let you know when there's something new about your orders.
        </Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (loadMoreStatus !== 'loading' || pageNumber <= 1) return null;

    return (
      <View style={notificationStyles.footerLoading}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  };

  const showFullScreenLoading = status === 'loading' && items.length === 0;
  const showFullScreenError = status === 'failed' && items.length === 0;

  return (
    <SafeAreaView style={commonStyles.screen} edges={['top', 'left', 'right']}>
      <BackHeader
        title="Notifications"
        rightText={unreadCount > 0 ? 'Mark all as read' : undefined}
        rightTextStyle={notificationStyles.markAllText}
        onRightPress={handleMarkAllAsRead}
      />

      {showFullScreenLoading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}

      {showFullScreenError && (
        <View style={notificationStyles.emptyContainer}>
          <Text style={notificationStyles.emptyTitle}>Something went wrong</Text>
          <Text style={notificationStyles.emptyText}>
            Unable to load notifications. Pull down to try again.
          </Text>
        </View>
      )}

      {!showFullScreenLoading && !showFullScreenError && (
        <SectionList
          sections={sections}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={handlePressNotification}
              onActionPress={handleActionPress}
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text style={notificationStyles.sectionLabel}>{section.title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          ItemSeparatorComponent={() => <View style={notificationStyles.separator} />}
          contentContainerStyle={notificationStyles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={status === 'loading' && items.length > 0}
          onRefresh={handleRefresh}
          onEndReachedThreshold={0.4}
          onEndReached={handleLoadMore}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
}