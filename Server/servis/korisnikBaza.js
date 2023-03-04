const Baza = require("./baza.js");

class KorisnikBaza {

	constructor() {
		this.baza = new Baza();
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		console.log(korime);
		let sql = "SELECT * FROM korisnik WHERE korime = ?"

		var podaci = await this.baza.izvrsiUpit(sql, [korime]);
		this.baza.zatvoriVezu();
		if (podaci.length == 1)
			return podaci[0];
		else
			return null;
	}


	dodaj = async function (korisnik) {

		console.log(korisnik);
		this.baza.spojiSeNaBazu();
		let sql = `INSERT INTO korisnik (ime,prezime,adresa,korime,lozinka,email,datum_rodjenja,tip_korisnika_id,token,sol,aktivan,TOTP) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`

		let podaci = [korisnik.ime, korisnik.prezime, korisnik.adresa,
		korisnik.korime, korisnik.lozinka, korisnik.email,
		korisnik.datum_rodjenja, 1,
		korisnik.aktivacijskiKod, "moja sol", 1, korisnik.TOTP];
		let uspijeh = true
		await this.baza.izvrsiUpit(sql, podaci)
			.catch((greska) => {
				console.log(greska);
				uspijeh = false;
			});
		return uspijeh;
		this.baza.zatvoriVezu();
	}

	azuriraj = async function (param, korisnik) {
		this.baza.spojiSeNaBazu();
		console.log(korisnik);
		let podaci = [korisnik.ime, korisnik.prezime, korisnik.adresa, korisnik.datum_rodjenja, korisnik.lozinka, param];
		let sql = `UPDATE korisnik SET ime = ? ,prezime = ?,adresa = ?,datum_rodjenja = ? , lozinka = ?  WHERE korime = ?`
		let uspijeh = true
		await this.baza.izvrsiUpit(sql, podaci)
			.catch((greska) => {
				console.log(greska);
				uspijeh = false;
			});
		return uspijeh;
		this.baza.zatvoriVezu();

	}

	aktiviraj = async function (param, kod) {
		this.baza.spojiSeNaBazu();

		let podaci = [param, kod];
		console.log(podaci);
		let sql = `UPDATE korisnik SET aktivan = 1 WHERE korime = ? AND token = ? `
		let uspijeh = true
		let odgovor = await this.baza.izvrsiUpit(sql, podaci)
			.catch((greska) => {
				console.log(greska);

			});
		console.log(odgovor);
		this.baza.zatvoriVezu();
		if (odgovor.affectedRows == 0) {
			return "Nije aktivirano";
		}
		else {
			return "Aktivirano";
		}



	}

	prijavi = async function (korime) {
		this.baza.spojiSeNaBazu();


		let sql = `SELECT lozinka FROM korisnik  WHERE korime = ?`
		let uspijeh = true
		let odgovor = await this.baza.izvrsiUpit(sql, [korime])
			.catch((greska) => {
				console.log(greska);
			});
		this.baza.zatvoriVezu();
		if (odgovor.length != 1)
			return { greska: "Nepostojeci korisnik" }
		else {
			console.log("odg->" + odgovor[0].lozinka);
			return odgovor[0].lozinka;
		}

		/*if(odgovor.affectedRows == 0)
		{
			return "Nije aktivirano";
		}
		else
		{
			return "Aktivirano";
		}*/



	}









	/*
		daj = async function (korime) {
			this.baza.spojiSeNaBazu();
			let sql = "SELECT * FROM korisnik WHERE korime=?;"
			var podaci = await this.baza.izvrsiUpit(sql, [korime]);
			this.baza.zatvoriVezu();
			if(podaci.length == 1)
				return podaci[0];
			else 
				return null;
		}
	
		dodaj = async function (korisnik) {
			console.log(korisnik)
			let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,tip_korisnika_id) VALUES (?,?,?,?,?,?)`;
			let podaci = [korisnik.ime,korisnik.prezime,
						  korisnik.lozinka,korisnik.email,korisnik.korime,1];
			await this.baza.izvrsiUpit(sql,podaci);
			return true;
		}
	
		obrisi = async function (korime) {
			let sql = "DELETE FROM korisnik WHERE korime=?";
			await this.baza.izvrsiUpit(sql,[korime]);
			return true;
		}
	
		azuriraj = async function (korime, korisnik) {
			let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, email=? WHERE id=?`;
			let podaci = [korisnik.ime,korisnik.prezime,
						  korisnik.lozinka,korisnik.email,korime];
			await this.baza.izvrsiUpit(sql,podaci);
			return true;
		}*/
}

module.exports = KorisnikBaza;