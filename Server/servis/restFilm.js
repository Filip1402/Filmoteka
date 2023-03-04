const FilmDao = require("./filmDao.js");
const TMDBklijent = require("./klijentTMDB.js");
const Konfiguracija = require("../konfiguracija.js");

class RestFilm {


    dohvatiFilmove = function (zahtjev, odgovor) {

        odgovor.type("application/json");
        let odobreno = zahtjev.query.odobreno
        let str = parseInt(zahtjev.query.stranica);
        let brFilmova = parseInt(zahtjev.query.brojFilmova);
        let datum = zahtjev.query.datum;
        let zanr_id = zahtjev.query.zanr;
        let naziv = zahtjev.query.naziv;
        let sort = zahtjev.query.sortiraj;
        
        let str_baza = (brFilmova * str) - brFilmova;
        if(brFilmova == undefined  ||str == undefined)
        {   
            
            odgovor.status(417);
                    console.log("greska resursi film")
                    odgovor.json({ Greska: "Krivi resursi" });
                    return
        }
        let fDao = new FilmDao()
        fDao.dajBrojFilmova(datum,zanr_id,naziv,odobreno).then(br_filmova => {
            let poruka = fDao.dajFilmove(str_baza, brFilmova, datum, zanr_id, naziv, sort,odobreno).then(rezultat => {
                //console.log("Rez -->" + rezultat)
                if (rezultat != null) {
                    let rez = {};
                    let maxStranica = Math.ceil(parseInt(br_filmova.broj_filmova)/brFilmova);
                    if(maxStranica == 0)
                        str = 0
                    rez.stranica = str;
                    //rez.push({"stranica" : str })
                    rez.broj_filmova = br_filmova.broj_filmova;
                    //rez.push(br_filmova)
                    rez.br_stranica = maxStranica;                    
                    //rez.push({"br_stranica" : maxStranica})
                    rez.rezultat = rezultat;
                    //rez.push({"rezultat" : rezultat[0]})
                    odgovor.status(200);
                    odgovor.json(rez)
                }
                else {
                    odgovor.status(500);
                    console.log("greska dohvacanje film")
                    odgovor.json({ Greska: "Došlo je do greske prilikom upisa u bazu" });
                }
            });
        })
    }

    dohvatiFilm = function (zahtjev, odgovor) {
        odgovor.type("application/json");

        let fDao = new FilmDao();
        let odg = {}
        let poruka = fDao.dajFilm(zahtjev.params.id).then(rezultat => {
            if (JSON.parse(rezultat)[0] != undefined) {
                console.log("here --> " + rezultat)
                let film =JSON.parse(rezultat)
                odg.film =film[0];
                //console.log(film[0])
                    fDao.dajDodaoFilm(film[0].unio_korisnik).then(rezultat1=>{
                    odg.korisnik = JSON.parse(rezultat1)[0]
                    fDao.dajZanroveFilm(film[0].id).then(rezultat2=>{
                        odg.zanrovi = JSON.parse(rezultat2)
                        odgovor.status(200);
                        odgovor.json(odg)
                    })
                    
                })

                
            }
            else {
                odgovor.status(500);
                odgovor.json({ Greska: "Došlo je do greske prilikom dohvacanja filma iz baze" });
            }

        })
    };

    odobriFilm = function (zahtjev, odgovor) {

        odgovor.type("application/json");

        let fDao = new FilmDao();
        //console.log(zahtjev.params.id)
        let poruka = fDao.odobri(zahtjev.params.id).then(rezultat => {
            if (rezultat != null) {
                odgovor.status(200);
                odgovor.json(JSON.parse(rezultat))
            }
            else {
                odgovor.status(500);
                odgovor.json({ Greska: "Došlo je do greske prilikom upisa u bazu" });
            }

        })
    };

    izbrisiFilm = function (zahtjev, odgovor) {

        odgovor.type("application/json");

        let fDao = new FilmDao();
        let poruka = fDao.brisi(zahtjev.params.id).then(rezultat => {
            if (rezultat != null) {
                odgovor.status(200);
                odgovor.json(JSON.parse(rezultat))
            }
            else {
                odgovor.status(500);
                odgovor.json({ Greska: "Došlo je do greske prilikom upisa u bazu" });
            }

        })
    };


    dodajFilm =  async function (zahtjev, odgovor) {
        
        

        odgovor.type("application/json");
        let konf = new Konfiguracija();
        let fDao = new FilmDao();
        await konf.ucitajKonfiguraciju();
        let tmdbKlijent = new TMDBklijent(konf.dajKonf()["tmdb.apikey.v3"]);
          tmdbKlijent.dohvatiFilm(zahtjev.body.id).then(film =>{
            console.log(JSON.parse(film));
            let poruka = fDao.dodaj(JSON.parse(film),zahtjev.body).then(rezultat => {
                //console.log("Rez -->" + rezultat)
                if (rezultat == true) {
                    let poruka1 = fDao.dodajZanroveFilma(JSON.parse(film).id, JSON.parse(film).genres).then(rezultat1 => {
                        //console.log("Rez1 -->" + rezultat)
                        if (rezultat1) {
                            odgovor.status(200);
                            odgovor.json({ Uspijeh: "Uspiješno ste dodali film i dodijelili mu zanrove" })
                        }
                        else {
                            odgovor.status(500);
                            console.log("greska zanr")
                            odgovor.json({ Greska: "Došlo je do greske prilikom upisa u bazu" });
                        }
                    });;
                }
                else {
                    odgovor.status(500);
                    console.log("greska film")
                    odgovor.json({ Greska: "Došlo je do greske prilikom upisa u bazu" });
                }
            });
         });

        
    }

} module.exports = RestFilm;