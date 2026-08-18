/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../store', () => ({
  store: {
    getState: () => ({}),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  },
}));

jest.mock('../navigation/AppNavigator', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return function MockAppNavigator() {
    return React.createElement(Text, null, 'Mock AppNavigator');
  };
});

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    NavigationContainer: ({ children }) => React.createElement(View, null, children),
  };
});

jest.mock('react-native-paper', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    PaperProvider: ({ children }) => React.createElement(View, null, children),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
  };
});

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
