const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  devtool: 'cheap-source-map',
  target: 'electron-renderer',
  context: __dirname,
  entry: {
    core: './lib/core/index.js',
    background: './lib/background/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    __dirname: isDev,
    __filename: isDev,
  },
  plugins: [
    isDev
      ? new HtmlWebpackPlugin({
          template: 'template.html',
          inject: false,
        })
      : null,
  ].filter(Boolean),
  optimization: {
    minimize: false,
  },
}
