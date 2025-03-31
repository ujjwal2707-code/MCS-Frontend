module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@assets': './src/assets',
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@services': './src/services',
          '@utils': './src/utils',
          '@context': './src/context',
          '@constants': './src/constants'
        },
      },
    ],
    'react-native-paper/babel',
    'react-native-reanimated/plugin'
  ],
};
