require('ignore-styles'); //ignoramos los css del lado del servidor porque no nos interesa nada de eso
require('@babel/register')({
  presets: ['@babel/preset-env', '@babel/preset-react'],
});

require('asset-require-hook')({
  extensions: ['jpg', 'png', 'gif'],
  name: '/assets/[hash].[ext]',
});

require('./server.js');
