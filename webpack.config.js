const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const cssRule = ({ exclude, modules, sourceMap, test, mode }) => ({
  test,
  exclude,
  use: [
    mode === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        sourceMap,
        modules: !!modules && {
          localIdentName:
            mode === "development"
              ? "[path][name]__[local]--[hash:base64:5]"
              : "[hash:base64]",
        },
        importLoaders: 2,
      },
    },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-flexbugs-fixes",
            "autoprefixer",
            "postcss-fail-on-warn",
          ],
        },
        sourceMap,
      },
    },
    {
      loader: "sass-loader",
      options: {
        // Prefer `dart-sass`
        implementation: require("sass"),
        sourceMap,
      },
    },
  ],
});

module.exports = (env, argv) => {
  const { mode } = argv;
  const isDevelopment = mode === "development";
  return {
    mode: isDevelopment ? "development" : "production",
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [
                  ["@babel/preset-env", { useBuiltIns: "usage", corejs: 3.18 }],
                ],
                plugins: [["@babel/plugin-transform-runtime", { corejs: 3 }]],
              },
            },
            "ts-loader",
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          use: "html-loader",
        },
        cssRule({
          test: cssRegex,
          exclude: cssModuleRegex,
          mode,
          sourceMap: isDevelopment,
        }),
        cssRule({
          test: cssModuleRegex,
          modules: true,
          mode,
          sourceMap: isDevelopment,
        }),
        cssRule({
          test: sassRegex,
          exclude: sassModuleRegex,
          mode,
          sourceMap: isDevelopment,
        }),
        cssRule({
          test: sassModuleRegex,
          modules: true,
          mode,
          sourceMap: isDevelopment,
        }),
      ],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      extensions: [".tsx", ".ts", ".js"],
    },
    devServer: {
      static: {
        directory: path.join(__dirname, "public"),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].bundle.js",
    },
    plugins: [
      new Dotenv(),
      new MiniCssExtractPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "public/index.html",
      }),
    ],
  };
};
