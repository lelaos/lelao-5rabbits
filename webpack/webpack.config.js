const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve('src/entry.js'),
  output: {
    filename: 'bundle.js',
    path: path.resolve('dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Lelao 5rabbits'
    })
  ]
}
