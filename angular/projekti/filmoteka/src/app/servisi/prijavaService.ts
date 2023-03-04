import {Injectable} from "@angular/core"
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class prijavaService{
    
    constructor(private router : Router){}

     async PrijaviKorisnika(tijelo : string )  {
        let zaglavlje : Headers = new Headers();
        zaglavlje.set("Content-Type", "application/json");
        let parametri = { method : "POST" , body: tijelo , headers: zaglavlje}
        let odgovor  = (await fetch("/prijava",parametri)) as Response;
        if(odgovor.status == 200)
        {   
            console.log("haha");
           this.router.navigate(["/pocetna"]);
            
        }
           
    }
}