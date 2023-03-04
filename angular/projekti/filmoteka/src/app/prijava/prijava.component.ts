import { Component } from '@angular/core';
import { prijavaService } from '../servisi/prijavaService';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.sass']
})
export class PrijavaComponent {
   korime?: string
   lozinka?: string
  constructor(private prijavaService : prijavaService){}

  PrijaviMe(){
    console.log("Prijava test prijava.comp")
    let tijelo = { korime : this.korime, lozinka : this.lozinka } 
    this.prijavaService.PrijaviKorisnika(JSON.stringify(tijelo));
  }

}
