const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require("dotenv-webpack");
const path = require("path");

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
        sourceMap: sourceMap || mode === "development",
        modules: !!modules,
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
        sourceMap: true,
      },
    },
    {
      loader: "sass-loader",
      options: {
        // Prefer `dart-sass`
        implementation: require("sass"),
        sourceMap: true,
      },
    },
  ],
});

module.exports = (env, argv) => {
  const { mode } = argv;
  return {
    mode: mode === "development" ? "development" : "production",
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          use: "html-loader",
        },
        cssRule({ test: cssRegex, exclude: cssModuleRegex, mode }),
        cssRule({ test: cssModuleRegex, modules: true, mode }),
        cssRule({ test: sassRegex, exclude: sassModuleRegex, mode }),
        cssRule({ test: sassModuleRegex, modules: true, mode }),
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
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
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
