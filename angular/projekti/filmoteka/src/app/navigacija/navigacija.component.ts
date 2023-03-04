import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AutentifikacijaService } from '../servisi/AutentifikacijaService';
import { JWTService } from '../servisi/JWTService';

@Component({
  selector: 'app-navigacija',
  templateUrl: './navigacija.component.html',
  styleUrls: ['./navigacija.component.sass']
})
export class NavigacijaComponent {

  isUser : boolean | undefined = false;
  isAdmin : boolean | undefined  = false;
  constructor(private jwtService :JWTService, private authService : AutentifikacijaService , private router : Router){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUserFeaturesNav();
        this.loadAdminFeaturesNav();
      }
    });
  }


  async loadUserFeaturesNav()
  {   
    let odg = await this.authService.AutentificirajKorisnika();
    if(odg != undefined)
      this.isUser = odg;
  }
  async loadAdminFeaturesNav()
  {
    let odg = await this.authService.AutentificirajAdmina();
    if(odg != undefined)
      this.isAdmin = odg;
  }



}
