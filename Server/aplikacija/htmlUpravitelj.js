const konst = require("../konstante.js");
const ds = require("fs/promises");
const Autentifikacija = require("./autentifikacija.js")
let auth = new Autentifikacija();
const jwt = require("./moduli/jwt.js")
const totp = require("./moduli/totp.js")
const fetchUpravitelj = require("./fetchUpravitelj.js");
const Konfiguracija = require("../konfiguracija.js");
const konf = new Konfiguracija();
const url = "http://localhost:"
let port;
let portRest;


exports.getPrijava = async function (zahtjev, odgovor) {

    let greska = ""
    if (zahtjev.method == "POST") {
        var korime = zahtjev.body.korime;
        var lozinka = zahtjev.body.lozinka;
        var prijavljen = await auth.prijaviKorisnika(korime, lozinka);
        await konf.ucitajKonfiguraciju();
        portRest = konf.dajKonf()["rest.port"]
        let podaci = await fetch(url+portRest+"/api/korisnici/" + zahtjev.body.korime); 
        let korisnik = await podaci.text();
        console.log(podaci.status)
        if(podaci.status == 500)
        {   
            odgovor.status(500)
            odgovor.send(korisnik)
            return
        }
        console.log("before prijava")
        korisnik = JSON.parse(korisnik);
        if (prijavljen) {
            console.log("in prijava")
            if (korisnik.aktivan != 1) {
                odgovor.status(401);
                odgovor.send("Korisnik nije aktivan")
                return;
            }
            let totpKljuc = korisnik.TOTP;
            let totpKod = zahtjev.body.totp;

           /* if (!totp.provjeriTOTP(totpKod, totpKljuc)) {

                greska = "TOTP nije dobar!"
            } else {*/

                zahtjev.session.jwt = jwt.kreirajToken(korisnik)
                zahtjev.session.korisnik = korisnik;
                console.log(zahtjev.session.korisnik)
                zahtjev.session.korime = korisnik.korime;
                odgovor.status(200);
                odgovor.send("Uspijeh!");
                return;
            //}
        } else {
            odgovor.status(401);
            greska = "Netocni podaci!";
            odgovor.send(greska);
        }
    }


}

exports.odjava = async function (zahtjev, odgovor) {
    zahtjev.session.korisnik = null;
    zahtjev.session.korime = null;
    zahtjev.session.jwt = null;
    console.log("odjava");
    odgovor.redirect("/pocetna");
};

exports.getRegistracija = async function (zahtjev, odgovor) {
    console.log("here out POST");
    let greska = ""
    if (zahtjev.method == "POST") {
        console.log("here POST");
        let uspjeh = await auth.dodajKorisnika(zahtjev.body);
        if (uspjeh) {
            odgovor.status(200);
            odgovor.send("Uspijeh!");
            return;
        } else {
            greska = "Dodavanje nije uspjelo provjerite podatke!";
        }
    }


}



exports.getStranica = function (zahtjev, odgovor) {
    odgovor.sendFile(__dirname + "/angular/index.html");
}
