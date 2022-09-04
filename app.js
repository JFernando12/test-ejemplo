const express = require('express');
const bodyParser = require('body-parser');
const router = require('./src/router.js');
const morgan = require('morgan');

const app = express();

// La version de sqlite3 ya no esta disponible, se tiene que actualizar.
// Instalar nodemon dara mas flexibilidad al momento de desarrollar.
// Instalar morgan, este nos dira las solicitudes realizadas y nos ayudara a comprender mejor que estamos realizando desde el navegador.
// Recomendaria cambiar un poco la estructura del codigo, tener las consultas a la base de datos en un archivo por separado e importarlas dentro del archivo de las rutas.
// Investigar hacerca del json y urlencoded que ya incluye express a partir de las nuevas versiones y evitar instalar body-parser para aligerar el codigo.
// Quitar el script de 'test' del package.json en caso que no vayamos a utilizarlo

// Excellent: Using capital letters for naming constants is a good practice!
const HTTP_PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', router);

// Start server
app.listen(HTTP_PORT, () => {
  console.log(`Server running on port ${HTTP_PORT}`);
});
