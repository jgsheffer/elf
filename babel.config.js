/** @type {import("@babel/core").TransformOptions["plugins"]} */
const plugins = [
  /** react-native-reanimated web support @see https://docs.swmansion.com/react-native-reanimated/docs/guides/web-support/ */
  "@babel/plugin-transform-export-namespace-from",
  [
    "module:react-native-dotenv",
    {
      moduleName: "@env",
      path: ".env",
    },
  ],
]

/** @type {import("@babel/core").TransformOptions} */
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {},
    },
    plugins: [
      '@babel/plugin-transform-class-static-block' 
    ],
  }
}
