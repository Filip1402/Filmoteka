import { Component, OnInit } from '@angular/core';
import { DatumService } from '../servisi/DatumService';
import { JWTService } from '../servisi/JWTService';
import { ProfilService } from '../servisi/ProfilService';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.sass'],
})
export class ProfilComponent implements OnInit {
  txtIme?: string;
  txtPrezime?: string;
  txtAdresa?: string;
  datumRodjenja?: string;
  txtKorime?: string;
  txtEmail?: string;
  pswLozinka?: string;

  constructor(
    private profilService: ProfilService,
    private jwtService: JWTService
  ) {}

  ngOnInit(): void {
    this.GetData();
  }
  async GetData() {
    let parametri = await this.jwtService.dajJWT();
    let korisnik = await this.profilService.GetUserData(parametri!!);
    if (korisnik != undefined) {
      this.txtIme = korisnik.ime;
      this.txtPrezime = korisnik.prezime;
      this.txtAdresa = korisnik.adresa;
      let datum = new DatumService().prikaziDatum(korisnik.datum_rodjenja!!)
      console.log(datum)
      this.datumRodjenja = datum
      this.txtKorime = korisnik.korime;
      this.txtEmail = korisnik.email;
    }
  }

  async UpdateProfil(){
    let tijelo = {ime: this.txtIme , prezime: this.txtPrezime, adresa : this.txtAdresa , datum_rodjenja : this.datumRodjenja , email: this.txtEmail,  korime : this.txtKorime, lozinka : this.pswLozinka } 
    let parametri = (await this.jwtService.dajJWT());
    if(parametri != undefined)
    {
      parametri.body = JSON.stringify(tijelo);
      console.log(tijelo);
      this.profilService.UpdateUserData(parametri);
    }
    
  }
}
