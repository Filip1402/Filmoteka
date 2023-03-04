const ZanrBaza = require("./zanrBaza.js");

class RestZanr {

    dajZanrove = function(zahtjev,odgovor){

        odgovor.type = ("application/json");
        let zbaza = new ZanrBaza();
        zbaza.dohvatiSve().then((zanrovi) =>{
            console.log(zanrovi) 
            odgovor.status(200);
            odgovor.json(zanrovi);
            return zanrovi;})

    }

    dodajZanr =  function (zahtjev, odgovor) {
        console.log("in add azanr");
        odgovor.type("application/json");
        let zBaza = new ZanrBaza();
        let poruka = zBaza.dodaj(zahtjev.body).then(rezultat => {
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

    azuriraj =  function (zahtjev, odgovor) {
        
        console.log("in azuriraj zanr");
        odgovor.type("application/json");
        let zBaza = new ZanrBaza();
        let poruka = zBaza.preimenuj(zahtjev.params.id,zahtjev.body).then(rezultat => {
            console.log("in then " + rezultat);
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

    izbrisiZanr = function(zahtjev,odgovor)
    {
        odgovor.type("application/json");
        let zBaza = new ZanrBaza();
        let poruka = zBaza.izbrisi(zahtjev.params.id).then(rezultat => {
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

    izbrisiZanrove = function(zahtjev,odgovor)
    {
        odgovor.type("application/json");
        let zBaza = new ZanrBaza();
        let poruka = zBaza.izbrisiSve().then(rezultat => {
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

    dajZanr = function(zahtjev,odgovor){

        odgovor.type = ("application/json");
        let zbaza = new ZanrBaza();
        zbaza.dohvati(zahtjev.params.id).then((zanrovi) =>{ 
            odgovor.status(200);
            odgovor.send(zanrovi);})

    }

}
 module.exports = RestZanr;