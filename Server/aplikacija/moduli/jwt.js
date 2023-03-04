const konst= require("../../konstante.js");
const jwt = require("jsonwebtoken")

exports.kreirajToken = function(korisnik){
	const nonce = generirajRand();
	let token = jwt.sign({ korisnik: korisnik.korime, nonce: nonce }, konst.tajniKljucJWT, { expiresIn: "15s" });
	//console.log(token);
    return token;
}

exports.provjeriToken = function(zahtjev) {
	
    if (zahtjev.headers.authorization != null) {
        
        let token = zahtjev.headers.authorization;
        try {
            let podaci = jwt.verify(token, konst.tajniKljucJWT);
            //console.log("JWT podaci: "+podaci);
			//console.log("JWT true");
			return true;
        } catch (e) {
            console.log(e)
			//console.log("JWT false");
            return false;
        }
    }
    return false;
}

exports.ispisiDijelove = function(token){
	let dijelovi = token.split(".");
	let zaglavlje =  dekodirajBase64(dijelovi[0]);
	//console.log(zaglavlje);
	let tijelo =  dekodirajBase64(dijelovi[1]);
	//console.log(tijelo);
	let potpis =  dekodirajBase64(dijelovi[2]);
	//console.log(potpis);
}

exports.dajTijelo = function(token){
	let dijelovi = token.split(".");
	return JSON.parse(dekodirajBase64(dijelovi[1]));
}

function dekodirajBase64(data){
	let buff = new Buffer(data, 'base64');
	return buff.toString('ascii');
}

function generirajRand() {
	// Generate a random string of 16 characters
	const nonce = Math.random().toString(36).substring(2, 18);
	return nonce;
  }



	