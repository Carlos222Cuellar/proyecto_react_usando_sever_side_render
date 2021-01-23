import dotenv from 'dotenv'; //importamos dotenv de dotenv

dotenv.config(); //lel config lo que hace es buscar en todos los directorios un archivo punto env y de el va tomar todas las variables que tenga

const { ENV, PORT } = process.env; // process esta en todos los proyectos con node y haciendo uso de .env como propiedad podemos accder a las variables de entorno en este caso llamamos a las que estan en el archivo .env

//exportemos las dos variables de entorno que queremos para poder usarlas en el server.js dentro de server
export default {
  env: ENV,
  port: PORT,
};
