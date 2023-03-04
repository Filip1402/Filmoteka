import { Component } from '@angular/core';
import { RegistracijaService } from '../servisi/RegistracijaService';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.sass']
})
export class RegistracijaComponent {
  ime?: string
  prezime?: string
  adresa?: string
  datum_rodjenja?: Date
  email?: string
  korime?: string
  lozinka?: string

  constructor(private registracijaService : RegistracijaService){}

  PrijaviMe() {
    console.log("Reg test reg.comp")
    let tijelo = {ime: this.ime , prezime: this.prezime, adresa : this.adresa , datum_rodjenja : this.datum_rodjenja , email: this.email,  korime : this.korime, lozinka : this.lozinka } 
    console.log(tijelo);
    this.registracijaService.RegistrirajKorisnika(JSON.stringify(tijelo));

  }
}
