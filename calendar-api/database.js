const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    /** Cannot open database */ 
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName text, 
            lastName text, 
            email text UNIQUE, 
            phone text UNIQUE,
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
      (err) => {
        if (err) { 
          /** Table already created */ 
        } else {
          /** Table created */ 
        }
      }
    );

    db.run(
      `CREATE TABLE appointment (
            id INTEGER PRIMARY KEY,
            appointments text
            )`,
      (err) => {
        if (err) { 
          /** Table already created */ 
        } else {
          /** Table created */ 
        }
      }
    );

    
  }
});

module.exports = db;
