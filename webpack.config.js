const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: slsw.lib.entries,
  devtool:
    process.env.NODE_ENV === "development" ? "inline-source-map" : undefined,
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"]
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  target: "node",
  externals: [/aws-sdk/],
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  }
};
