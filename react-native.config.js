module.exports = {
    project: {
      ios: {},
      android: {},
    },
    "react-native-vector-icons": {
      platforms: {
        ios: null,
      },
    },
    assets: ["./src/assets/fonts/","./src/assets/images/"],
    getTransformModulePath() {
      return require.resolve("react-native-typescript-transformer");
    },
    getSourceExts() {
      return ["ts", "tsx"];
    },
  };