import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AutentifikacijaService } from './AutentifikacijaService';


@Injectable({
    providedIn: 'root'
})
export class Guard implements CanActivate {
    constructor(private authService: AutentifikacijaService, private router: Router) { }

    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {
        if (await this.authService.AutentificirajKorisnika() == true) {
            return true;
        } else {
            this.router.navigate(['/prijava']);
            return false;
        }
    }
}
