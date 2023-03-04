const konst = require("../konstante.js");
const express = require('express')
const Konfiguracija = require("../konfiguracija.js");
//const portovi = require(konst.dirPortova + "portovi_rest.js");
const RestKorisnik = require("./restKorisnik.js");
const RestZanr = require("./restZanr.js");
const RestFilm = require("./restFilm.js");
const RestTMDB = require("./restTMDB.js");
let port;
let portApp;
const server = express();
const konf = new Konfiguracija();
const restKorisnik = new RestKorisnik();
const restZanr = new RestZanr();
const restFilm = new RestFilm();
const jwt = require("../aplikacija/moduli/jwt.js")
const cors = require('cors')
server.use(express.urlencoded({ extended: true }));
server.use(express.json());


konf.ucitajKonfiguraciju().then(priprema).catch(greska => {

  console.log(greska);
  if (process.argv.length == 2) {
    console.error("Potrebno je dati naziv datoteke");
  }
  else {
    console.error("Nije moguce otvoriti datoteku: " + greska.path);
  }
  process.exit();
})

function priprema() {
  port = konf.dajKonf()["rest.port"]
  portApp = konf.dajKonf()["app.port"]
  var corsOptions = {
    origin: 'http://localhost:' + konf.dajKonf()["app.port"],
    optionsSuccessStatus: 200
  }
  server.use(cors(corsOptions));

  pokreni()
}

function pokreni() {
  server.get("/pair", async (req, res) => {
    res.status(200)
    res.json({ uspijeh: "Server online" })
  })

  putanjeTMDB();
  putanjeRestKorisnici();
  putanjeRestZanrovi()
  putanjeRestFilmovi()
  nijeImplementirano()
  server.use((zahtjev, odgovor) => { odgovor.status(404); odgovor.json({ "Greska": "Ta putanja ne postoji" }); })

  server.listen(port, () => {
    console.log(`Server pokrenut na portu: ` + port);
  });
}


function putanjeTMDB() {
  let restTMDB = new RestTMDB(konf.dajKonf()["tmdb.apikey.v3"]);
  server.get("/api/tmdb/zanr", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restTMDB.getZanr.bind(restTMDB)(req, res)
    }
  });
  server.get("/api/tmdb/filmovi", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restTMDB.getFilmovi.bind(restTMDB)(req, res)
    }
  });
}

function putanjeRestKorisnici() {
  server.get('/api/korisnici', (req, res) => {
    restKorisnik.getKorisnici(req, res);
  })

  server.get('/api/korisnici/:korime', (req, res) => {
    restKorisnik.getKorisnik(req, res);
  })

  server.post("/api/korisnici", async (req, res) => {
    restKorisnik.addKorisnik(req, res);
  })

  server.put("/api/korisnici/:korime", async (req, res) => {
    restKorisnik.UpdateKorisnik(req, res);
  })
  //NEPOTREBNO ZA ZADACU 2
  /*server.put("/api/korisnici/:korime/aktivacija", async (req, res) => {   
    restKorisnik.aktivirajKorisnika(req, res);
  })*/

  server.post("/api/korisnici/:korime/prijava", async (req, res) => {
    restKorisnik.prijaviKorisnika(req, res);
  })
}

function putanjeRestZanrovi() {

  server.get("/api/zanr", (req, res) => {
    if (!jwt.provjeriToken(req) && req.headers.referer != "http://localhost:" + portApp + "/pocetna" && req.headers.referer != "http://localhost:" + portApp + "/") {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restZanr.dajZanrove(req, res);
    }

  })

  server.get("/api/zanr/:id", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restZanr.dajZanr(req, res);
    }
  })

  server.post("/api/zanr", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restZanr.dodajZanr(req, res);
    }
  })

  server.delete("/api/zanr", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restZanr.izbrisiZanrove(req, res);
    }
  })

  server.put("/api/zanr/:id", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restZanr.azuriraj(req, res);
    }
  })

  server.delete("/api/zanr/:id", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restZanr.izbrisiZanr(req, res);
    }
  })
}

function putanjeRestFilmovi() {
  server.post("/api/filmovi", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restFilm.dodajFilm(req, res);
    }

  })

  server.get("/api/filmovi/", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restFilm.dohvatiFilmove(req, res)
    }

  });
  server.get("/api/filmovi/:id", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restFilm.dohvatiFilm(req, res)
    }
  });

  server.put("/api/filmovi/:id", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restFilm.odobriFilm(req, res);
    }
  })
  server.delete("/api/filmovi/:id", async (req, res) => {
    if (!jwt.provjeriToken(req)) {
      res.status(401);
      res.json({ greska: "neaoutorizirani pristup" });
    } else {
      restFilm.izbrisiFilm(req, res)
    }
  })

}

function nijeImplementirano() {
  server.put("/api/korisnici", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.delete("/api/korisnici", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.post("/api/korisnici/:korime", async (req, res) => {
    res.status(405)
    res.json({ greska: "metoda nije dopuštena" })
  })
  server.delete("/api/korisnici/:korime", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.get("/api/korisnici/:korime/aktivacija", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.delete("/api/korisnici/:korime/aktivacija", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.post("/api/korisnici/:korime/aktivacija", async (req, res) => {
    res.status(405)
    res.json({ greska: "metoda nije dopuštena" })
  })
  server.get("/api/korisnici/:korime/prijava", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.put("/api/korisnici/:korime/prijava", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.delete("/api/korisnici/:korime/prijava", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.put("/api/filmovi/", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.delete("/api/filmovi/", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.post("/api/filmovi/:id", async (req, res) => {
    res.status(405)
    res.json({ greska: "metoda nije dopuštena" })
  })
  server.post("/api/zanr/:id", async (req, res) => {
    res.status(405)
    res.json({ greska: "metoda nije dopuštena" })
  })
  server.put("/api/zanr/", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.post("/api/tmdb/zanr", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.put("/api/tmdb/zanr", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.delete("/api/tmdb/zanr", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.post("/api/tmdb/filmovi", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.put("/api/tmdb/filmovi", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })
  server.delete("/api/tmdb/filmovi", async (req, res) => {
    res.status(501)
    res.json({ greska: "metoda nije implementirana" })
  })

}