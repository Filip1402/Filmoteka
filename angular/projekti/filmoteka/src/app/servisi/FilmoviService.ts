
import { TmplAstBoundAttribute } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DiscoverMoviesI } from './DiscoverMoviesI';
import { FilmDetaljiI } from './FilmDetaljiI';
import { FilmI } from './FilmI';
import { FilmoviBazaI } from './FilmoviBazaI';
import { FilmTMDBI } from './FilmTMDBI';
import { JWTService } from './JWTService';

@Injectable({
    providedIn: 'root',
})
export class FilmoviService {
    constructor(private jwtService: JWTService) { }

    async dajFilmove(stranica: number,kljucnaRijec?:string) {
        if(kljucnaRijec == undefined)
            kljucnaRijec = ""
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        let odgovor = await fetch(environment.restServer+"/api/tmdb/filmovi?stranica=" + stranica + "&kljucnaRijec=" + kljucnaRijec,parametri)
        if(odgovor.status == 200)
        {
            let podaci =  JSON.parse(await odgovor.text()) as DiscoverMoviesI;
            return podaci;
        }
        return;



    }

    async dodaj(tijelo : string)
    {   
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        (parametri.headers as Headers).set("Content-Type", "application/json");
        parametri.body = tijelo;
        parametri.method = "POST";
        let odgovor = await fetch("/dodajFilm", parametri) as Response;
        console.log(odgovor.status);
        return odgovor.status == 200
            
    }

    async dajFilmovePremaParametrima(stranica : number , zanr: string = "" , datum : string = "",  sort : string = "" , odobreno : boolean = true)
    {
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        let url = "/dohvatiFilmove/?stranica=" + stranica + "&datum=" + datum + "&zanr=" + zanr + "&sortiraj=" + sort;
        if(odobreno)
            url+="&odobreno="+1;
        else
            url+="&odobreno="+0;
        let odgovor = await fetch(url,parametri)
        if(odgovor.status == 200)
        {   
            let podaci =  JSON.parse(await odgovor.text()) as FilmoviBazaI;     
            return podaci;
        }
        return;
    }

    async dajFilm(id : number)
    {   
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        let odgovor = await fetch(environment.restServer+ "/api/filmovi/" + id,parametri)
        if(odgovor.status == 200)
        {   
            let podaci =  JSON.parse(await odgovor.text());
            console.log(podaci);     
            return podaci  as FilmDetaljiI;
        }
        return; 
    }

    async OdobriFilm(film : FilmI)
    {   
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        (parametri.headers as Headers).set("Content-Type", "application/json");
        parametri.method = "PUT"

        let odgovor = await fetch(environment.restServer+ "/api/filmovi/" + film.id,parametri)
        this.SkiniPoster(film);
        return odgovor.status == 200;

    }

    async BrisiFilm(film : FilmI)
    {   
        let parametri = await this.jwtService.dajJWT();
        if (parametri == undefined)
            return;
        (parametri.headers as Headers).set("Content-Type", "application/json");
        parametri.method = "DELETE"
        let odgovor = await fetch(environment.restServer+ "/api/filmovi/" + film.id, parametri);
        return odgovor.status == 200;

    }


    async SkiniPoster(film : FilmI)
    {
        if(!film.poster_path)
            return;
        let parametri = await this.jwtService.dajJWT();
            if (parametri == undefined)
                return;
        (parametri.headers as Headers).set("Content-Type", "application/json");
        await fetch("/poster?path=" + film.poster_path + "&ime=" + film.title, parametri)
    }

    
}



