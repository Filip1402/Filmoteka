const konst = require("../konstante.js");
let portRest;
const url = "http://localhost:";
const Konfiguracija = require("../konfiguracija.js");
const konf = new Konfiguracija();
//const kodovi = require("./moduli/kodovi.js")

class FilmoviZanroviPretrazivanje {

    
        
    
    async dohvatiFilmove(stranica, kljucnaRijec) {
        await konf.ucitajKonfiguraciju()
        portRest = konf.dajKonf()["rest.port"]
        let putanja = url + portRest+"/api/tmdb/filmovi?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec
        console.log(putanja)
        let odgovor = await fetch(putanja);
        let podaci = await odgovor.text();
        let filmovi = JSON.parse(podaci);
        //console.log(filmovi)
        return filmovi;
    }

    async dodajFilm(film_id, id_korisnika,jwt) {

        await konf.ucitajKonfiguraciju()
        portRest = konf.dajKonf()["rest.port"]
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        let datum = new Date();
        let film = {}
        film.id = film_id;
        film.datum_unosa = datum.getFullYear() + "-" + (datum.getMonth() + 1) + '-' + datum.getDate() + ' ' + datum.getHours() + ":" + datum.getMinutes() + ":" + datum.getSeconds();
        film.unio_korisnik = id_korisnika;
        film.galerija_putanja = ""      //TODO
        film.odobreno = 0;
        console.log(film);
        zaglavlje.set('Authorization', jwt);
        let parametri = {
            method: "POST",
            body: JSON.stringify(film),
            headers: zaglavlje
        }


        let odgovor = await fetch(url + portRest +"/api/filmovi", parametri);

        console.log(odgovor.status);
        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            return JSON.parse(podaci);
        }
        else
            return false;
    }


} module.exports = FilmoviZanroviPretrazivanje;