import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { JWTService } from './JWTService';
import { ZanrI } from './ZanrI';
import { ZanrTMDBI } from './ZanrTMDBI';

@Injectable({
    providedIn: 'root',
})
export class ZanroviService {
    constructor(private jwtService: JWTService) { }

    async getZanrovi(checkAuth : boolean = true) {
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined && checkAuth)
            return;
        let odgovor = await fetch(environment.restServer + "/api/zanr", parametri);
        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            return JSON.parse(podaci) as ZanrI[];
        }
        return;
    }

    async getZanroviTMDB() {
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        let odgovor = await fetch(environment.restServer + "/api/tmdb/zanr", parametri);
        if (odgovor.status == 200) {
            let podaci = await odgovor.text();
            console.log(JSON.parse(podaci) as ZanrTMDBI[]);
            return JSON.parse(podaci) as ZanrTMDBI[];
        }
        return;
    }

    async dodajZanr(tijelo: string) {
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        console.log("here")
        parametri.method = 'POST'
        parametri.body = tijelo as BodyInit
        (parametri.headers as Headers).set("Content-Type", "application/json")

        let odgovor = await fetch(environment.restServer + '/api/zanr', parametri);
        let podaci = await odgovor.text();
        console.log(podaci);
        if (odgovor.status == 200) {
            return "Zanr dodan";
        }
        else
            return "Zanr " + JSON.parse(tijelo).naziv + " vec postoji!";
    }

    async IzbrisiZanrove()
    {

        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;

        parametri.method = 'DELETE'
        let odgovor = await fetch(environment.restServer+'/api/zanr', parametri);
        return odgovor.status == 200
            
    }

    async azurirajZanr(tijelo : string,id_zanr : number )
    {
        let parametri = await this.jwtService.dajJWT();
        if(parametri == undefined)
            return;
        parametri.method = 'PUT'
        parametri.body = tijelo as BodyInit;
        (parametri.headers as Headers).set("Content-Type", "application/json");
        console.log(environment.restServer + '/api/zanr/'+ id_zanr);
        let odgovor = await fetch(environment.restServer + '/api/zanr/'+ id_zanr, parametri);
        return odgovor.status == 200

    }



}