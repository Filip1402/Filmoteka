import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JWTService } from './JWTService';

@Injectable({
  providedIn: 'root',
})
export class AutentifikacijaService {
  constructor(private router: Router, private jwtService: JWTService) { }

  async AutentificirajKorisnika() {
    let parametri = await this.jwtService.dajJWT();
    if (parametri != undefined) {
      let odg = await fetch('/autentificiraj', parametri);
      return (odg.status == 200);
    }
    else
      return;

  }

  async AutentificirajAdmina() {
    let parametri = await this.jwtService.dajJWT();
    if (parametri != undefined) {
      let odg = await fetch('/jeAdmin', parametri);
      console.log(await odg.text())
      return (odg.status == 200);
    }
    else
      return;
  }



}
