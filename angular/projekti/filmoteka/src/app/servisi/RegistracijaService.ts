import {Injectable} from "@angular/core"
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class RegistracijaService{
    
    constructor(private router : Router){}

     async RegistrirajKorisnika(tijelo : string )  {
        let zaglavlje : Headers = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        let parametri = { method : "POST" , body: tijelo , headers: zaglavlje}
        let odgovor  = (await fetch("/registracija",parametri)) as Response;
        if(odgovor.status == 200)
        {   
           this.router.navigate(["/prijava"]); 
        }
           
    }
}