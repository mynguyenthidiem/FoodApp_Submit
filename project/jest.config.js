module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-async-storage/async-storage|react-native-gesture-handler|@react-navigation|react-native-paper|react-native-safe-area-context|react-native-screens|react-native-vector-icons|react-redux|@reduxjs/toolkit|immer)/)',
  ],
};
