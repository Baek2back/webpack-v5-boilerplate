import path from "path";
import Dotenv from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

type Configuration = WebpackConfiguration & {
  devServer?: WebpackDevServerConfiguration;
};

const isDevelopment = process.env.NODE_ENV !== "production";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

type CssRuleArgs = {
  exclude?: RegExp;
  modules: boolean;
  sourceMap: boolean;
  test: RegExp;
};

const cssRule = ({ exclude, modules, sourceMap, test }: CssRuleArgs) => ({
  test,
  exclude,
  use: [
    isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        sourceMap,
        modules: !!modules && {
          localIdentName: isDevelopment
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
        additionalData: `
          @use "sass:color";
          @use "sass:list";
          @use "sass:map";
          @use "sass:math";
          @use "sass:meta";
          @use "sass:selector";
          @use "sass:string";
          @use "@/mixins" as mixins;
        `,
      },
    },
  ],
});

const config: Configuration = {
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
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      cssRule({
        test: cssRegex,
        exclude: cssModuleRegex,
        modules: false,
        sourceMap: isDevelopment,
      }),
      cssRule({
        test: cssModuleRegex,
        modules: true,
        sourceMap: isDevelopment,
      }),
      cssRule({
        test: sassRegex,
        exclude: sassModuleRegex,
        modules: false,
        sourceMap: isDevelopment,
      }),
      cssRule({
        test: sassModuleRegex,
        modules: true,
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
    filename: "[name].[hash:8].js",
    sourceMapFilename: "[name].[hash:8].map",
    chunkFilename: "[id].[hash:8].js",
    publicPath: "/",
  },
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /node_modules/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
  },
};

export default config;
