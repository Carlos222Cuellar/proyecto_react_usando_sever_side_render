/* eslint-disable global-require */
import express from 'express' ; //importamos express
import webpack from 'webpack'; //importamos webpack
import React from 'react';
import helmet from 'helmet';//importamos helmet
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { renderRoutes } from 'react-router-config';
import { StaticRouter } from 'react-router-dom';
import reducer from '../fronted/reducers/index';
import initialState from '../fronted/initialState';
import routes from '../fronted/routes/serverRoutes';//importamos nuestras rutas que le vamos a pasar al staticRouter
import config from '../config/index'; //importamos el archivo de configuracion de config

const app = express(); //llamamos a app y le decimos que es igual a una instancia de react

const { env, port } = config; //destructuramos el objeto config

//para ver si estamos en el ambiente de desarrollo hacemos los siguiente
if (env === 'development') {
  console.log('corriendo en el ambiente de desarrollo');
  //vamos a definir varias costantes en esta validacion
  //la primera es que vamos a llamar a la configuraicon de webpack que tenemos en nuestro proeycto
  const webpackConfig = require('../../webpack.config');
  //creamos las constantes de los paquetes que acabamos de instalar que son
  const webpackDevMiddleware = require('webpack-dev-middleware');
  //creamos la otra constante de la webpack
  const webpackHotMiddleware = require('webpack-hot-middleware');
  //creamos otra constante que va ser el compiler que es el encargado de compilar nuestro proyecto proyecto segun nuestra configuracion
  const compiler = webpack(webpackConfig); //webpack es el que importamos arriba tambien puede sevir como una funcion a este le pasamos la configuraicon que teniamos de webpack para nuestro proyecto
  //creamos una constante que se va llamar serverConfig que va recibir un objeto
  //va recibir dos cosas el primero es el puerto y el segundo es el hotMiddleware
  //const serverConfig = { port: puerto, hot: true };
  const { publicPath } = webpackConfig.output;
  const serverConfig = { serverSideRender: true, publicPath };
  //ahora le decimos a app que use estas configuraciones de la siguiente manera
  app.use(webpackDevMiddleware(compiler, serverConfig));//este recibe dos parametros que es el compiler y el serverConfig
  app.use(webpackHotMiddleware(compiler));
} else { //si no es de desarrollo significa que le vamos a pasar datos para producccion
  app.use(express.static(`${__dirname}/public`));//queremos mandar las cosnfiguraciones a la carpeta publica que tenemos en el proyecto
  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());//estamos bloqueando que no se permitan los croos domain policies
  app.disable('x-powered-by'); //para que el navegador no se pasa desde donde nos estamos conectando
}

//funcion que nos va ayudar a renderizar nuestra aplicacion que es la que se va encargar de convertir nuestra app en string
//que va ser una funcion que recibe dos parametros uno es la peticion y el otro la respuesta lo primero que tenemos que hacer es definir nuestro store

const setResponse = (html, preloadedState) => { //recibe del render el html y el store precargado
  return (`
  <!DOCTYPE html>
  <html>
    <head>
    <link rel="stylesheet" href="assets/app.css" type="text/css">
      <title>Platzi Video</title>
    </head>
    <body>
      <div id="app"> ${html}</div>
      <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
      <script src="assets/app.js" type="text/javascript"></script>
    </body>
  </html>,
  `);
};

const renderApp = (req, res) => {
  const store = createStore(reducer, initialState);
  const preloadedState = store.getState();
  const html = renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} context={{}}>
        { renderRoutes(routes) }
      </StaticRouter>
    </Provider>,
  );
  res.set('Content-Security-Policy', "default-src 'self'; img-src 'self' http://dummyimage.com; script-src 'self' 'sha256-fqAyYQw90BvHA2X8Dgsi3fckwxSvBr0kTnVVFxqUOls='; style-src-elem 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com");

  res.send(setResponse(html, preloadedState));
};

app.get('*', renderApp);

//app.get('*', (req, res) => { //recibe una funcion anonima como segundo parametro esta funcion anonoma recibe dos parametros tambien el request que es lo que nos piden y tambien recibe la respuesta que le vamos a dar al cliente que nos hace el request
// res.send(
// // { response: 'hello express runing with nodemon' },
//   `<!DOCTYPE html>
// <html>
//   <head>
//   <link rel="stylesheet" href="assets/app.css" type="text/css">
//     <title>Platzi Video</title>
//   </head>
//     <body>
//       <div id="app"></div>
//       <script src="assets/app.js" type="text/javascript"></script>
//     </body>
//   </html>`,
//   );//es lo que le vamos a contestar al usuario.
// }); //es donde como la direcciones donde vamos a hacer las peticiones donde esta el asterico podemos poner la direccion en especifico en este caos vamos a tomar todas las direcciones que recibamos

app.listen(port, (err) => { //usamos las variables de entorno para indicar el puerto asi ya no quemamos nuesto puerto
  if (err) {
    console.log(err);
  } else {
    console.log(`servidor corriendo en: http://localhost:${port}`);//usamos template literals para poder mostrar el numero de puerto en el que esta corriendo la app
  }
}); //es el puerto donde va estar escuchando peticiones nuestro servidor tambien recibe una funcion anonimo donde se captura el error si es que lo hay
