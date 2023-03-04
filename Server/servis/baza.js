const konst = require("../konstante.js");
const sqlite3 = require("sqlite3");
const fs = require("fs");

class Baza {

  constructor() {
    
  }

  spojiSeNaBazu(){
    this.db = new sqlite3.Database("../baza.sqlite", (err) => {
        if (err) {
          console.error(err.message);
        }
      });
  }


  izvrsiUpit(sql, podaciZaSQL, povratnaFunkcija) {
    this.db.all(sql, podaciZaSQL, povratnaFunkcija);
  }

  izvrsiUpit(sql, podaciZaSQL) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, podaciZaSQL, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
  zatvoriVezu() {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  }
}

module.exports = Baza;