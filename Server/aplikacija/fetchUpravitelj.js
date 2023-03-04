const FilmoviPretrazivanje = require("./pretrazi_filmove.js");
const jwt = require("./moduli/jwt.js")
const Autentifikacija = require("./autentifikacija.js")
let auth = new Autentifikacija();
let fp = new FilmoviPretrazivanje();
const kodovi = require("./moduli/kodovi.js")
const Konfiguracija = require("../konfiguracija.js");
const konf = new Konfiguracija();
const ds = require("fs/promises");
let portRest;
const baseUrl = "http://localhost:"



exports.getJWT = async function (zahtjev, odgovor) {
    odgovor.type('json')
    if (zahtjev.session.jwt != null) {
        let k = { korime: jwt.dajTijelo(zahtjev.session.jwt).korime };
        let noviToken = jwt.kreirajToken(k)
        zahtjev.session.jwt = noviToken;
        //console.log(noviToken)
        odgovor.send({ ok: noviToken });
        return
    }
    odgovor.status(401);
    odgovor.send({ greska: "nemam token!" });
}



exports.azurirajProfil = async function (zahtjev, odgovor) {
    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "neaoutorizirani pristup" });
    }
    else {
        let zaglavlje = new Headers();
        zaglavlje.set("Content-Type", "application/json");

        console.log(zahtjev.body.lozinka)
        zahtjev.body.lozinka = kodovi.kreirajSHA256(zahtjev.body.lozinka, "moja sol" + zahtjev.session.korime);
        console.log(zahtjev.body.lozinka);
        let parametri = {
            method: "PUT",
            body: JSON.stringify(zahtjev.body),
            headers: zaglavlje

        }
        await konf.ucitajKonfiguraciju()
        portRest = konf.dajKonf()["rest.port"]
        
        let odg = await fetch(baseUrl+portRest+'/api/korisnici/' + zahtjev.session.korime, parametri);

        if(zahtjev.body.ime != undefined)
        zahtjev.session.korisnik.ime = zahtjev.body.ime
        if(zahtjev.body.prezime != undefined)
        zahtjev.session.korisnik.prezime = zahtjev.body.prezime
        if(zahtjev.body.adresa != undefined)
        zahtjev.session.korisnik.adresa = zahtjev.body.adresa
        if(zahtjev.body.datum_rodjenja != undefined)
        zahtjev.session.korisnik.datum_rodjenja = zahtjev.body.datum_rodjenja
        

        let podaci = await odg.text();
        odgovor.send(podaci);
    }


}


exports.dodajFilm = async function (zahtjev, odgovor) {
    console.log("fetchUpravitelj")
    odgovor.type("application/json");
    console.log(zahtjev.body);
    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "neaoutorizirani pristup" });
    } else {
        console.log(zahtjev.session.jwt);
        let odg = await fp.dodajFilm(zahtjev.body.id, zahtjev.session.korisnik.id,zahtjev.session.jwt);
        console.log(odg);
        if (odg == false)
            odgovor.status(500);
        else
            odgovor.status(200);
        odgovor.json(odg);
    }
}

exports.dohvatiProfil = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "neaoutorizirani pristup" });
    } else {

        odgovor.status(200);
        console.log(zahtjev.session.korisnik.tip_korisnika_id)
        odgovor.json(zahtjev.session.korisnik)

    }
}


exports.dohvatiFilmove = async function (zahtjev, odgovor) {
    odgovor.type("application/json");
    if (!jwt.provjeriToken(zahtjev)) {
        odgovor.status(401);
        odgovor.json({ greska: "neaoutorizirani pristup" });
    } else {
        let br;
        let konf = new Konfiguracija()
        await konf.ucitajKonfiguraciju().catch(greska => console.log(greska));

        br = konf.dajKonf()["app.broj.stranica"];
        let stranica = zahtjev.query.stranica;
        let odobreno = zahtjev.query.odobreno
        if (stranica == undefined) {
            odgovor.status(500)
            odgovor.json({ greksa: "Nisu neseni obavezni parametri" })
            return
        }

        let filterDatum = zahtjev.query.datum;
        let filterZanr = zahtjev.query.zanr;
        let sort = zahtjev.query.sortiraj;
        let naziv = zahtjev.query.naziv;
        
        portRest = konf.dajKonf()["rest.port"]
        let url = baseUrl+portRest+"/api/filmovi/";
        url += "?stranica=" + stranica;
        url += "&brojFilmova=" + br;
        if (filterDatum != undefined && filterDatum!= "")
            url += "&datum=" + filterDatum
        if (filterZanr != undefined && filterZanr!= "")
            url += "&zanr=" + filterZanr
        if (sort != undefined  && sort!= "")
            url += "&sortiraj=" + sort;
        if (naziv != undefined && naziv!= "")
            url += "&naziv=" + naziv;
        if (odobreno != undefined && odobreno!= "")
            url += "&odobreno=" + odobreno;
        let zaglavlje = new Headers();
        zaglavlje.set('Authorization', zahtjev.session.jwt);
        let parametri = { headers: zaglavlje };
        let odg = await fetch(url,parametri)
        let podaci = await odg.text()
        odgovor.send(podaci)
    }

}


exports.dajDvaFilma = async function (zahtjev, odgovor) {

    odgovor.type("application/json");
    let konf = new Konfiguracija()
    await konf.ucitajKonfiguraciju().catch(greska => console.log(greska));
    br = konf.dajKonf()["app.broj.stranica"];

    portRest = konf.dajKonf()["rest.port"]
    let zaglavlje = new Headers();
        zaglavlje.set('Authorization', jwt.kreirajToken("test"));
        let parametri = { headers: zaglavlje };
    let odg = await fetch(baseUrl+portRest+"/api/filmovi?stranica=1&brojFilmova=" + br + "&zanr=" + zahtjev.query.zanr,parametri);
    let podaci = await odg.text();
    if(odg.status == 200)
    {
    console.log(podaci)
    let filmovi = JSON.parse(podaci);
    //console.log(filmovi)
    let maxIndex = br - 1;

    if (filmovi.broj_filmova < br)
        maxIndex = filmovi.broj_filmova - 1;

    let rez = [filmovi.rezultat[kodovi.dajNasumceBroj(0, maxIndex)],
    filmovi.rezultat[kodovi.dajNasumceBroj(0, maxIndex)]];
    if(rez[0] == rez[1])
        rez.pop();
    if(rez[0] != null)
    {   
        odgovor.status(200);
        odgovor.send(rez);
    }
    else{
        odgovor.status(404);
        odgovor.statusMessage = "Data not found for this film";
        odgovor.send();
    }
    }
    else
    {   
        odgovor.status(500)
        odgovor.send(podaci)
    }

}




exports.dohvatiPoster = async function (zahtjev, odgovor) {
    console.log("here")
    odgovor.type("application/json");
    if (!jwt.provjeriToken(zahtjev) || (zahtjev.session.korisnik != undefined && zahtjev.session.korisnik.tip_korisnika_id != 2) ) {
        odgovor.status(401);
        odgovor.json({ greska: "neaoutorizirani pristup" });
    } else {

        let odg = await fetch("https://image.tmdb.org/t/p/w600_and_h900_bestv2/" + zahtjev.query.path)
        if (odg.status == 200)
            odgovor.status(200)
        else
            odgovor.status(500)
        //let podaci = await odg.text()
        //ds.writeFile(zahtjev.query.ime+".png",podaci)
        const arrayBuffer = await odg.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        let ext = (zahtjev.query.path).split(".")[1]
        console.log(ext)
            //const outputFileName = `yourfilenamehere.${fileType.ext}`
            ds.writeFile("./posteri/"+zahtjev.query.ime+"."+ext,buffer);
       
        odgovor.send(arrayBuffer)
    }

}






