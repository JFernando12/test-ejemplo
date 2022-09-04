const express = require('express');
const db = require('./database.js');

const router = express.Router();

console.log(Date.now())

router.get('/api/articles', (req, res, next) => {
  const sql = 'select * from article';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      // Evitar poner las comillas en las keys.
      res.status(403).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Success',
      data: rows,
    });
  });
});

router.get('/api/article/:id', (req, res, next) => {
  const sql = `select * from article where id = ${req.params.id}`;
  const params = [];
  db.get(sql, params, (err, row) => {
    if (err) {
      // Evitar poner las comillas en las keys.
      // Nunca se envian los errores del servidor o base de datos al cliente, siempre errores genericos.
      res.status(403).json({ error: err.message });
      return;
    }
    // Can be better: Before submitting work, please make sure that all lines of code containing debugger and console.log are deleted.
    // Debemos validar que exista informacion.
    console.log('row: ', row);
    res.json({
      message: 'Success',
      data: row,
    });
  });
});

// Se podria quitar el ultimo parentesis para mantener el mismo estandar en todo el codigo.
router.post('/api/article/', (req, res, next) => {
  // Me parece muy buena esta forma de validacion, pero se podria mejorar con los middlewares, lo puedes checar aqui.
  // Podemos extraer los valores de un inicio para no repetir el req.body.
  const errors = [];
  if (!req.body.title) {
    errors.push('title is required');
  }
  if (!req.body.body) {
    errors.push('body is required');
  }
  if (errors.length) {
    // Falto el espacio despues de la comilla para mejor presentacion.
    res.status(400).json({ error: errors.join(',') });
    return;
  }
  // Esto se podria evitar si desde un principio extraemos los valores del body.
  const data = {
    title: req.body.title,
    body: req.body.body,
    // La fecha debe ser generada en automatico.
    date: req.body.date,
  };
  const sql = 'INSERT INTO article (title, body, date) VALUES (?,?,?)';
  const params = [data.title, data.body, data.date];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(403).json({ error: err.message });
      return;
    }
    // El id deberia estar dentro de la data.
    // Cuando se crea un nuevo objeto, se debe devolver el codigo 201.
    res.json({
      message: 'Success',
      data: data,
      id: this.lastID,
    });
  });
});

router.put('/api/article/:id', (req, res, next) => {
  // Esto no es necesario, ya que el req.body contiene el objeto ya elaborado y podemos extraerlo directamente. Nuestra principal preocupacion seria validar los datos previamente.
  const data = {
    title: req.body.title,
    body: req.body.body,
  };
  // Can be better: Before submitting work, please make sure that all lines of code containing debugger and console.log are deleted.
  console.log(data);
  // Recomendaria extraer la consulta y los parametros en sus respectivas constantes, como se hizo en los demas endpoints.
  db.run(
    `UPDATE article set 
           title = COALESCE(?,title),
           body = COALESCE(?,body)
           WHERE id = ?`,
    [data.title, data.body, req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        // Nunca se envian los errores del servidor o base de datos al cliente, siempre errores genericos.
        res.status(403).json({ error: res.message });
        return;
      }
      res.json({
        message: 'Success',
        data: data,
      });
    }
  );
});

router.delete('/api/article/:id', (req, res, next) => {
  // Recomendaria extraer la consulta y los parametros en sus respectivas constantes, como se hizo en los demas endpoints.
  db.run(
    'DELETE FROM article WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        // Nunca se envian los errores del servidor o base de datos al cliente, siempre errores genericos.
        res.status(403).json({ error: res.message });
        return;
      }
      // Podriamos avisar cuando no se encuentra el usuario.
      res.json({ message: 'Deleted', rows: this.changes });
    }
  );
});

router.get('/', (req, res, next) => {
  res.json({ message: 'Ok' });
});

module.exports = router;
