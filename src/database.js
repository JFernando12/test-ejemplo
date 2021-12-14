const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

const db = new sqlite3.Database(DBSOURCE, (err) => {
    // Needs correcting:
    // It is very important to have correctly formatted code to improve readability.
    // It is recommended to use a linter to identify errors: https://www.npmjs.com/package/eslint
    if (err) {
      console.error(err.message);
      throw err;
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE article (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title text, 
            body text, 
            date text
            )`,(err) => {
            if (err) {
                console.log('Table already created');
            } else {
                console.log('Table just created');
            }
        });
    }
});


module.exports = db;

