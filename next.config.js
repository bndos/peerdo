const webpack = require("webpack");
const { parsed: myEnv } = require("dotenv").config();

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    // Merge local environment variables with the ones in the pipeline
    const env = { ...myEnv, ...process.env };
    config.plugins.push(new webpack.EnvironmentPlugin(env));
    return config;
  },
};
