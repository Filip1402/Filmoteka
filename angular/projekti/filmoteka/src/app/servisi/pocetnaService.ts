import {Injectable} from "@angular/core"
import { FilmI } from "./FilmI";
import { ZanrI } from "./ZanrI";

@Injectable({
    providedIn: 'root'
})

export class pocetnaService{
    
    constructor(){}

   /* async dohvatiZanrove() : Promise<Array<ZanrI>> {
        let odgovor  = (await fetch("/api/zanr")) as Response;
        
        let podaci = await odgovor.json();
        if(Array.isArray(podaci))
            return podaci;
        else 
            return [podaci];
    }*/
    async dohvatiFilmove(zanr : ZanrI) : Promise<Array<FilmI> | null> {
        let odgovor  = (await fetch("/dajDvaFilma?zanr="+zanr.id_tmdb)) as Response;
        if(odgovor.status == 200)
        {
            let podaci = await odgovor.json();
            console.log(podaci);
            if(Array.isArray(podaci))
                return podaci;
            else 
                return [podaci];
        }
        return null;
    }
}