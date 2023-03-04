const KorisnikDAO = require("./korisnikBaza.js");

class RestKorisnik {


    getKorisnici = function (zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(200);
        let kdao = new KorisnikDAO();
        kdao.dajSve().then((korisnici) => {
            odgovor.send(JSON.stringify(korisnici));
        });
    }

    getKorisnik = function (zahtjev, odgovor) {

        odgovor.type("application/json");
        
        let kdao = new KorisnikDAO();
        kdao.daj(zahtjev.params.korime).then((korisnik) => {
            console.log("this" + typeof korisnik + korisnik);
            if(korisnik != null)
            {
                odgovor.status(200);
                odgovor.send(korisnik);
            }
            else
            {
                odgovor.status(500);
                odgovor.send({greska : "korisnik ne postoji"})
            }
            
        });
    }

    UpdateKorisnik = function (zahtjev, odgovor) {

        odgovor.type("application/json");
        odgovor.status(200);
        let kdao = new KorisnikDAO();
        kdao.azuriraj(zahtjev.params.korime,zahtjev.body).then((korisnici) => {
            odgovor.send(korisnici);
        });
    }

    aktivirajKorisnika = function (zahtjev,odgovor)
    {
        odgovor.type("application/json");
        odgovor.status(200);
        let kdao = new KorisnikDAO();
        console.log(zahtjev.body);
        kdao.aktiviraj(zahtjev.params.korime,zahtjev.body.aktivacijskiKod).then((korisnici) => {
            odgovor.send(korisnici);
        });
    }

    prijaviKorisnika = function (zahtjev,odgovor)
    {
        odgovor.type("application/json");
        odgovor.status(200);
        let kdao = new KorisnikDAO();
        console.log(zahtjev.body);
        kdao.prijavi(zahtjev.params.korime).then((lozinka) => {
            console.log("Lozinka baza -> " + lozinka);
            console.log("lozinka body -> " + zahtjev.body.lozinka);
            if(lozinka == zahtjev.body.lozinka)
            {
                odgovor.status(200);
                odgovor.send("Uspijesna prijava");
            }
            else
            {
                odgovor.status(401);
                odgovor.send("Neovlasteni pristup");
            }
            
        });
    }




    addKorisnik = function (zahtjev, odgovor) {
        odgovor.type("application/json");
        let kdao = new KorisnikDAO();
        let poruka = kdao.dodaj(zahtjev.body).then(rezultat => {
            console.log("in then" + rezultat);
            if (rezultat) {
                odgovor.status(200);
                odgovor.send("Uspijeh")
            }
            else {
                odgovor.status(500);
                odgovor.send("Greska");
            };
        });
    }





}
module.exports = RestKorisnik;






























/*exports.postKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.dodaj(podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
}

exports.deleteKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnici = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.getKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.daj(korime).then((korisnik) => {
        console.log(korisnik);
        odgovor.send(JSON.stringify(korisnik));
    });
}

exports.getKorisnikPrijava = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let kdao = new KorisnikDAO();
    let korime = zahtjev.params.korime;
    kdao.daj(korime).then((korisnik) => {
        console.log(korisnik)
        console.log(zahtjev.body)
        if(korisnik!=null && korisnik.lozinka==zahtjev.body.lozinka)
            odgovor.send(JSON.stringify(korisnik));
        else{ 
            odgovor.status(401)
            odgovor.send(JSON.stringify({greska: "Krivi podaci!"}))
        }
    });
}
exports.postKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(405);
    let poruka = { greska: "metoda nije dopuštena" }
    odgovor.send(JSON.stringify(poruka));
}

exports.deleteKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    odgovor.status(501);
    let poruka = { greska: "metoda nije implementirana" }
    odgovor.send(JSON.stringify(poruka));
}

exports.putKorisnik = function (zahtjev, odgovor) {
    odgovor.type("application/json")
    let korime = zahtjev.params.korime;
    let podaci = zahtjev.body;
    let kdao = new KorisnikDAO();
    kdao.azuriraj(korime, podaci).then((poruka) => {
        odgovor.send(JSON.stringify(poruka));
    });
}*/