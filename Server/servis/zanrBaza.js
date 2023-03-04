const Baza = require("./baza.js");

class ZanrBaza {

    constructor() {
        this.baza = new Baza();
    }

    dohvatiSve = async function () {
        this.baza.spojiSeNaBazu();
        let sql = `SELECT * FROM zanr`;
        var podaci = await this.baza.izvrsiUpit(sql, []).catch(greska => {console.log(greska)});
        this.baza.zatvoriVezu();
        return podaci;

    }

    dohvati = async function (id) {
        this.baza.spojiSeNaBazu();
        let sql = `SELECT * FROM zanr WHERE id = ?`;
        var podaci = await this.baza.izvrsiUpit(sql, [id]);
        this.baza.zatvoriVezu();
        return podaci;

    }

    dodaj = async function (zanr) {


        this.baza.spojiSeNaBazu();
        let sql = `INSERT INTO zanr (naziv,id_tmdb) VALUES (?,?)`
        let podaci = [zanr.naziv, zanr.id_tmdb];
        let uspijeh = true;
        await this.baza.izvrsiUpit(sql, podaci)
            .catch((greska) => {
                console.log(greska);
                uspijeh = false;
            });
        return uspijeh;
        this.baza.zatvoriVezu();
    }

    izbrisiSve = async function () {

        this.baza.spojiSeNaBazu();
        let sql = `DELETE FROM zanr WHERE id_tmdb NOT IN (SELECT fz.zanr_id FROM film_zanr fz)`
        let uspijeh = true;
        await this.baza.izvrsiUpit(sql, [])
            .catch((greska) => {
                console.log(greska);
                uspijeh = false;
            });
        return uspijeh;
        this.baza.zatvoriVezu();
    }

    izbrisi = async function (id) {

        this.baza.spojiSeNaBazu();
        let sql = `DELETE  FROM zanr WHERE id = ?`
        let uspijeh = true;
        await this.baza.izvrsiUpit(sql, [id])
            .catch((greska) => {
                console.log(greska);
                uspijeh = false;
            });
        return uspijeh;
        this.baza.zatvoriVezu();
    }

    preimenuj =  async function (id,zanr) {
        
        this.baza.spojiSeNaBazu();
        console.log(zanr);
        let sql = `UPDATE zanr SET naziv = ? WHERE id = ?`
        let uspijeh = true;
        let podaci = [zanr.naziv,id];
        let odg =await this.baza.izvrsiUpit(sql, podaci)
            .catch((greska) => {
                console.log(greska);
                uspijeh = false;
            });
        
        /*if(odg.affectedRows == 0)
        {
            return uspijeh = false;;
        }*/
        return uspijeh;
        this.baza.zatvoriVezu();
    }

}
module.exports = ZanrBaza;