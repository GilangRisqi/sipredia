const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  devtool: isDev ? 'inline-source-map' : false,
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 9090,
    hot: true,
    historyApiFallback: true,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|webp|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name].[hash][ext]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name].[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      favicon: './public/favicon.ico',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'public/icons', to: 'icons' },
        { from: 'public/_redirects', to: '.' },
        ...(isDev ? [{ from: 'public/sw.js', to: 'sw.js' }] : []),
      ],
    }),
    ...(isDev
      ? []
      : [
          new InjectManifest({
            swSrc: './public/sw.js',
            swDest: 'sw.js',
            maximumFileSizeToCacheInBytes: 5000000, // 5MB limit
          }),
          new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[contenthash].css',
          }),
        ]),
  ],
  resolve: {
    extensions: ['.js'],
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@presenters': path.resolve(__dirname, 'src/presenters'),
      '@assets': path.resolve(__dirname, 'assets'),
    },
  },
};
