import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KorsinikI } from './KorisnikI';

@Injectable({
  providedIn: 'root',
})
export class ProfilService {


  constructor(private router : Router) {}

  async GetUserData(parametri: RequestInit)  {
    let odgovor = (await fetch('/profil/podaci', parametri)) as Response;
    if (odgovor.status == 200) {
        let podaci = await odgovor.text();
        console.log(podaci);
      let korisnik = JSON.parse(podaci) as KorsinikI;
      return korisnik;
    }
    else
    {
        return;
    } 
       
  }

  async UpdateUserData(parametri: RequestInit)  {
    parametri.method = "PUT";
    ((parametri.headers!!) as Headers).set("Content-Type", "application/json");
    let odgovor  = (await fetch("/azurirajProfil",parametri)) as Response;
    if(odgovor.status == 200)
    {   
       this.router.navigate(["/profil"]); 
    }

  }
}
