const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      //{ test: /\.svg$/, loader: 'svg-inline-loader' }
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ]
  },
  output: { 
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};