const konst = require("../konstante.js");
const kodovi = require("./moduli/kodovi.js")
const totp = require("./moduli/totp.js")
const Konfiguracija = require("../konfiguracija.js");
const konf = new Konfiguracija();
const url = "http://localhost:"
let port;
let portRest;

class Autentifikacija {
    async dodajKorisnika(korisnik) {
        let tijelo = {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            lozinka: kodovi.kreirajSHA256(korisnik.lozinka, "moja sol" + korisnik.korime),
            email: korisnik.email,
            korime: korisnik.korime,
            datum_rodjenja : korisnik.datum_rodjenja,
            adresa : korisnik.adresa
        };
    
        let aktivacijskiKod = kodovi.dajNasumceBroj(10000, 99999);
        tijelo["aktivacijskiKod"] = aktivacijskiKod;
        let tajniTOTPkljuc = totp.kreirajTajniKljuc(korisnik.korime);
        tijelo["TOTP"] = tajniTOTPkljuc;

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        await konf.ucitajKonfiguraciju();
        portRest = konf.dajKonf()["rest.port"]
        let odgovor = await fetch(url + portRest + "/api/korisnici", parametri)

        if (odgovor.status == 200) {
            console.log("Korisnik ubačen na servisu");
            return true;
        } else {
            console.log(odgovor.status);
            console.log(await odgovor.text());
            return false;
        }
    }


    async prijaviKorisnika(korime, lozinka) {
        lozinka = kodovi.kreirajSHA256(lozinka, "moja sol" + korime);
        console.log("loz->"+lozinka);
        let tijelo = {
            lozinka: lozinka,
        };

        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        let parametri = {
            method: 'POST',
            body: JSON.stringify(tijelo),
            headers: zaglavlje
        }
        await konf.ucitajKonfiguraciju();
        portRest = konf.dajKonf()["rest.port"]
        let odgovor = await fetch(url + portRest + "/api/korisnici/" + korime + "/prijava", parametri)
        if (odgovor.status == 200) {
            return true;
        } else {
            console.log("Error");
            return false;
        }
    }

}
module.exports = Autentifikacija;