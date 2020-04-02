'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const webpack = require('webpack')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')

// https://github.com/zenghongtu/create-electron-react/issues/3
// const whiteListedModules = ['react', 'react-dom'];

const isProd = process.env.NODE_ENV === 'production'
const isNotProd = process.env.NODE_ENV !== 'production'
const srcPath = path.resolve('src')

let rendererConfig = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    renderer: path.join(__dirname, '../src/renderer/index.tsx'),
  },
  // externals: [
  //   ...Object.keys(dependencies || {}).filter(
  //     d => !whiteListedModules.includes(d)
  //   )
  // ],
  watch: true,
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
        include: [srcPath],
      },
      {
        test: /\.sass$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader?indentedSyntax',
        ],
        include: [srcPath],
      },
      {
        test: /\.less$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'less-loader',
        ],
        include: [srcPath],
      },
      {
        test: /\.css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
        include: [srcPath],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]',
          },
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]',
          },
        },
      },
    ],
  },
  node: {
    __dirname: isNotProd,
    __filename: isNotProd,
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['renderer'],
      template: path.resolve(__dirname, '../src/index.ejs'),
      templateParameters(compilation, assets, options) {
        return {
          compilation: compilation,
          webpack: compilation.getStats().toJson(),
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options: options,
          },
          process,
        }
      },
      minify: {
        removeRedundantAttributes: true, // 删除多余的属性
        collapseWhitespace: true, // 折叠空白区域
        removeAttributeQuotes: true, // 移除属性的引号
        removeComments: true, // 移除注释
        collapseBooleanAttributes: true, // 省略只有 boolean 值的属性值 例如：readonly checked
      },
      nodeModules: isNotProd
        ? path.resolve(__dirname, '../node_modules')
        : false,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron'),
  },
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.node'],
  },
  target: 'electron-renderer',
}

/**
 * Adjust rendererConfig for development settings
 */
if (isNotProd) {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      __static: `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
    }),
  )
}

/**
 * Adjust rendererConfig for production settings
 */
if (isProd) {
  rendererConfig.devtool = ''
  rendererConfig.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({ extractComments: false }),
      new OptimizeCSSAssetsPlugin({}),
    ],
  }

  rendererConfig.plugins.push(
    new MiniCssExtractPlugin({ filename: '[name].style.css' }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/electron/static'),
        ignore: ['.*'],
      },
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  )
}

const iframeConfig = merge({
  customizeArray: merge.unique(
    'plugins',
    ['HtmlWebpackPlugin'],
    (plugin) => plugin.constructor && plugin.constructor.name,
  ),
})(rendererConfig, {
  entry: {
    iframe: path.join(__dirname, '../src/iframe/index.tsx'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'iframe.html',
      chunks: ['iframe'],
      template: path.resolve(__dirname, '../src/iframe/index.html'),
      templateParameters(compilation, assets, options) {
        return {
          compilation: compilation,
          webpack: compilation.getStats().toJson(),
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options: options,
          },
          process,
        }
      },
      minify: {
        removeRedundantAttributes: true, // 删除多余的属性
        collapseWhitespace: true, // 折叠空白区域
        removeAttributeQuotes: true, // 移除属性的引号
        removeComments: true, // 移除注释
        collapseBooleanAttributes: true, // 省略只有 boolean 值的属性值 例如：readonly checked
      },
      nodeModules: isNotProd
        ? path.resolve(__dirname, '../node_modules')
        : false,
    }),
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    path: path.join(__dirname, '../dist/electron'),
  },
})

module.exports = [rendererConfig, iframeConfig]
