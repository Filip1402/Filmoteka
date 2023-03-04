const Baza = require("./baza.js");

class FilmDao {

    constructor() {
        this.baza = new Baza();
    }



    dodaj = async function (f, podaci_unos) {



        this.baza.spojiSeNaBazu();
        //console.log(f)
        //console.log(podaci_unos)
        let sql = `INSERT INTO film(id,adult,backdrop_path,budget,homepage,imdb_id,original_language,original_title, overview, popularity,release_date,poster_path,revenue,runtime,status,tag_line,title, video, vote_average, vote_count,datum_unosa, unio_korisnik, odobreno, galerija_putanja)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        let podaci = [
            f.id, f.adult, f.backdrop_path, f.budget, f.homepage, f.imdb_id, f.original_language, f.original_title, f.overview, f.popularity, f.release_date,
            f.poster_path, f.revenue, f.runtime, f.status, f.tag_line, f.title, f.video, f.vote_average, f.vote_count, podaci_unos.datum_unosa,
            podaci_unos.unio_korisnik, podaci_unos.odobreno, podaci_unos.galerija_putanja];
        let uspijeh = true;
        await this.baza.izvrsiUpit(sql, podaci)
            .catch((greska) => {
                console.log(greska);
                uspijeh = false;
            });
        console.log("film -->" + uspijeh)
        return uspijeh;
        this.baza.zatvoriVezu();


    }

    dodajZanroveFilma = async function (film_id, zanrovi) {


        this.baza.spojiSeNaBazu();
        let uspijeh = true;
        console.log(zanrovi);
        for (let i = 0; i < Object.keys(zanrovi).length; i++) {
            let sql = `INSERT INTO film_zanr (zanr_id,film_id) SELECT * FROM (SELECT ?, ?) AS tmp WHERE EXISTS ( SELECT * FROM zanr WHERE id_tmdb = ? )`
            
            let podaci = [zanrovi[i].id, film_id, zanrovi[i].id];
            console.log(sql);
            console.log(podaci);
            await this.baza.izvrsiUpit(sql, podaci)
                .catch((greska) => {
                    console.log(greska);
                    uspijeh = false;
                });

        }
       // console.log("zanr -->" + uspijeh)
        return uspijeh;
        this.baza.zatvoriVezu();
    }


    dajBrojFilmova = async function (datum, zanr_id, naziv, odobreno) {
       /* console.log("datum-->" + datum)
        console.log("zanr-->" + zanr_id)
        console.log("naziv-->" + naziv)*/
        this.baza.spojiSeNaBazu();
        let podaci = []
        let sql = `SELECT COUNT(*) as broj_filmova FROM film`
        if (datum != undefined) {
            sql += ` WHERE datum_unosa BETWEEN ? AND ?`
            let danas = new Date();
            podaci.push(datum)
            podaci.push(danas.getFullYear() + "-" + (danas.getMonth() + 1) + '-' + danas.getDate() + ' ' + danas.getHours() + ":" + danas.getMinutes() + ":" + danas.getSeconds())

        }
        if (zanr_id != undefined) {
            if (datum != undefined)
                sql += " AND"
            else
                sql += " WHERE"
            sql += ` EXISTS (SELECT * from film_zanr WHERE zanr_id = ? AND film_id = id)`
            podaci.push(zanr_id)
        }
        if (naziv != undefined) {
            if (datum != undefined || zanr_id != undefined)
                sql += " AND"
            else
                sql += " WHERE"
            sql += `  original_title LIKE ?`
            podaci.push("%" + naziv + "%")
        } 
        if (odobreno != undefined) {
            if (datum != undefined || zanr_id != undefined || naziv != undefined)
                sql += " AND"
            else
                sql += " WHERE"
            sql += `  odobreno = ?`
            podaci.push(odobreno)
        }

       // console.log("count--> " + sql)
        let odgovor = await this.baza.izvrsiUpit(sql, podaci).catch((greska) => {
            console.log(greska);

        });
        //console.log(odgovor)
        //console.log(odgovor)
        if(odgovor != undefined)
        return (odgovor[0])
        this.baza.zatvoriVezu();
        return {greska : "Greska prilikom dohvata filmova"};
    }

    dajFilmove = async function (stranica, broj, datum, zanr_id, naziv, sort, odobreno) {

        if (stranica != undefined && broj != undefined) {
            let uspijeh = true;
            this.baza.spojiSeNaBazu();
            //console.log(stranica)
            //console.log(broj)
            let podaci = []
            let sql = `SELECT *,(SELECT min(zanr_id) FROM film_zanr WHERE film_id = id) as zanr FROM film`
            
            if (datum != undefined) {

                sql += ` WHERE datum_unosa BETWEEN ? AND ?`
                let danas = new Date();
                podaci.push(datum)
                podaci.push(danas.getFullYear() + "-" + (danas.getMonth() + 1) + '-' + danas.getDate() + ' ' + danas.getHours() + ":" + danas.getMinutes() + ":" + danas.getSeconds())

            }
            if (zanr_id != undefined) {
                if (datum != undefined)
                    sql += " AND"
                else
                    sql += " WHERE"
                sql += ` EXISTS (SELECT * from film_zanr WHERE zanr_id = ? AND film_id = id)`
                podaci.push(zanr_id)
            }
            if (naziv != undefined) {
                if (datum != undefined || zanr_id != undefined)
                    sql += " AND"
                else
                    sql += " WHERE"
                sql += `  original_title LIKE ?`
                podaci.push("%" + naziv + "%")
            }

            if (odobreno != undefined) {
                if (datum != undefined || zanr_id != undefined || naziv != undefined)
                    sql += " AND"
                else
                    sql += " WHERE"
                sql += `  odobreno = ?`
                podaci.push(odobreno)
            }
            if (sort == 'd')
                sql += ` ORDER BY datum_unosa ASC`
            else if (sort == 'n')
                sql += ` ORDER BY original_title ASC`
            else if (sort == 'z')
                sql += ` ORDER BY zanr ASC`
            podaci.push(broj)
            podaci.push(stranica)
            sql += " LIMIT ? OFFSET ?"
          //  console.log(sql)
            
            let odgovor = await this.baza.izvrsiUpit(sql, podaci).catch((greska) => {
                console.log(sql);
                console.log(podaci);
                console.log("GREŠKA->" + greska);

            });

            return (odgovor)
            this.baza.zatvoriVezu();
        }
        else
            return

    }

    dajFilm = async function (id) {

        let uspijeh = true;
        this.baza.spojiSeNaBazu();
        
        let sql = "SELECT * FROM film WHERE id = ?"
        let odgovor = await this.baza.izvrsiUpit(sql, [id]).catch((greska) => {
            console.log(greska);

        });
        
        return (JSON.stringify(odgovor))
        this.baza.zatvoriVezu();

    }

    dajDodaoFilm = async function (id) {

        let uspijeh = true;
        this.baza.spojiSeNaBazu();
        
        let sql = "SELECT ime,prezime FROM korisnik WHERE id = ?"
        let odgovor = await this.baza.izvrsiUpit(sql, [id]).catch((greska) => {
            console.log(greska);

        });
        return (JSON.stringify(odgovor))
        this.baza.zatvoriVezu();

    }

    dajZanroveFilm = async function (id) {

        let uspijeh = true;
        this.baza.spojiSeNaBazu();
        
        let sql = "SELECT naziv FROM zanr WHERE id_tmdb IN ( SELECT zanr_id FROM film_zanr WHERE film_id = ?)"
        let odgovor = await this.baza.izvrsiUpit(sql, [id]).catch((greska) => {
            console.log(greska);

        });
        return (JSON.stringify(odgovor))
        this.baza.zatvoriVezu();

    }

    odobri = async function (id) {

        let uspijeh = true;
        this.baza.spojiSeNaBazu();
        let sql = `UPDATE film SET odobreno = 1 WHERE id = ?`
        //console.log(id)
        let odgovor = await this.baza.izvrsiUpit(sql, [id]).catch((greska) => {
            console.log(greska);
            uspijeh = false
        });
        return uspijeh;//TODO response
        this.baza.zatvoriVezu();

    }

    brisi = async function (id) {

        let uspijeh = true;
        this.baza.spojiSeNaBazu();
        let sql = `DELETE FROM film WHERE id = ?`

        let odgovor = await this.baza.izvrsiUpit(sql, [id]).catch((greska) => {
            console.log(greska);

        });
        return (JSON.stringify(odgovor))//TODO response
        this.baza.zatvoriVezu();

    }






} module.exports = FilmDao;
