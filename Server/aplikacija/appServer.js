const konst = require("../konstante.js");
const express = require('express');
let port;
let portRest;
const url = "http://localhost:"
const html_upravitelj = require("./htmlUpravitelj.js");
const fetchUpravitelj = require("./fetchUpravitelj.js");
const sesija = require('express-session');
const kolacici = require('cookie-parser');
const jwt = require("./moduli/jwt.js")
const Konfiguracija = require("../konfiguracija.js");
const server = new express();
const konf = new Konfiguracija();



server.use(express.urlencoded({ extended: true }));
server.use(express.json());


konf.ucitajKonfiguraciju().then(provjera).catch(greska => {
    console.log(process.argv.length);
    console.log(greska);
    if (process.argv.length == 2) {
        console.error("Potrebno je dati naziv datoteke");
    }
    else {
        console.error("Nije moguce otvoriti datoteku: " + greska.path);
    }
    process.exit();
})

async function provjera() {
    port = konf.dajKonf()["app.port"];
    portRest = konf.dajKonf()["rest.port"];
    console.log(url + portRest + "/pair")
    let odg = await fetch(url + portRest + "/pair").catch(greska => process.exit())
    console.log(odg.status)
    let podaci = JSON.parse(await odg.text())
    console.log(podaci)
    if (odg.status == 200)
        pokreni()
    else {
        console.log("here");
        process.exit();
    }
}


function pokreni() {
    console.log("pokreni")
    server.use(kolacici())
    server.use(sesija({
        secret: konst.tajniKljucSesija,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 3 },
        resave: false
    }));


    putanjeKorisnici();
    putanjeFilmovi();
    putanjeStranice();





    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });

}

function putanjeStranice() {
    server.use(express.static(__dirname + "/angular"));
    server.use("/posteri", express.static(__dirname + "/posteri"));
    server.use("/dokumentacija", express.static(__dirname + "/dokumentacija"));
    server.use("/slike", express.static(__dirname + "/slike"));



    server.use("*", html_upravitelj.getStranica);


}

function putanjeKorisnici() {

    server.get("/autentificiraj", async (zahtjev, odgovor) => {

        if (!jwt.provjeriToken(zahtjev)) {
            odgovor.status(401);
            odgovor.json({ greska: "neaoutorizirani pristup" });
        }
        else {
            odgovor.status(200);
            odgovor.json({ uspijeh: "dopušten pristup" });
        }
    })
    server.get("/jeAdmin", async (zahtjev, odgovor) => {

        if (zahtjev.session.korisnik.tip_korisnika_id == 2) {
            odgovor.status(200)
            odgovor.json({ uspijeh: "Admin ste woho" })
        }
        else {
            odgovor.status(401)
            odgovor.json({ greska: "Niste admin nedozvoljin pristup" })
        }
    })

    server.get("/profil/podaci", fetchUpravitelj.dohvatiProfil);
    server.post("/registracija", html_upravitelj.getRegistracija)
    server.put("/azurirajProfil", fetchUpravitelj.azurirajProfil);
    server.post("/prijava", html_upravitelj.getPrijava);
    server.get("/getJWT", fetchUpravitelj.getJWT);
    server.get("/odjava", html_upravitelj.odjava);
}




function putanjeFilmovi() {

    server.get("/dajDvaFilma", fetchUpravitelj.dajDvaFilma)
    server.get("/dohvatiFilmove/", fetchUpravitelj.dohvatiFilmove)
    server.post('/dodajFilm', async (zahtjev, odgovor) => {
        fetchUpravitelj.dodajFilm(zahtjev, odgovor);
    })
    server.get("/poster", fetchUpravitelj.dohvatiPoster);




}



