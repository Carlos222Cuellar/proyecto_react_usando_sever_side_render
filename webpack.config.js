const path = require('path');
const webpack = require('webpack'); //lo queremos para agregar un nuevo plugin
require('dotenv').config();
//const HtmlWebPackPlugin = require('html-webpack-plugin'); LO quitamos para la nueva configuracion  del server react con express
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = (process.env.ENV === 'development'); //para ver si estamos en producccion o desarrollo
const entry = ['./src/fronted/index.js'];//si es produccion solo necesitamos esto en nuestro entry

if (isDev) { //si estamos en desarrollo debemos qagregar lo del hot middleware
  entry.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true');
}

module.exports = {
  entry, //recibe el entry que declaramos arriba
  mode: process.env.ENV, //le indicamos en el modo que estamos trabajando si no al compilar nos dara un warning que los pide
  output: {
    path: path.resolve(__dirname, 'src/server/public'),
    filename: 'assets/app.js', //le cambiamos el nombre de bundle.js a assets/app.js
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(s*)css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|gif|jpg)$/,
        use: [
          {
            'loader': 'file-loader',
            options: {
              name: 'assets/[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    //agregar mi nuevo plugin para la configuracion de webpack pero si estamos en produccion no lo queremos
    isDev ?
      new webpack.HotModuleReplacementPlugin() :
      () => {}, //este nos permitira hacer el refresco en caliente de nuestra aplicacion
    // new HtmlWebPackPlugin({
    //   template: './public/index.html',
    //   filename: './index.html',
    // }), qutamos el plugin
    new MiniCssExtractPlugin({
      filename: 'assets/app.css', //tambien modificamos el nombre de assets/[name].css a assets/app.css
    }),
  ],
};
