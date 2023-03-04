import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { FilmComponent } from './film/film.component';
import { FilmoviPregledComponent } from './filmovi-pregled/filmovi-pregled.component';
import { FilmoviPretrazivanjeComponent } from './filmovi-pretrazivanje/filmovi-pretrazivanje.component';
import { FilmoviPrijeloziComponent } from './filmovi-prijelozi/filmovi-prijelozi.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { ProfilComponent } from './profil/profil.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { Guard } from './servisi/Guard';
import { GuardAdmin } from './servisi/GuardAdmin';
import { ZanroviComponent } from './zanrovi/zanrovi.component';

const routes: Routes = [
{path: '', component: PocetnaComponent}, 
{path: 'pocetna', component: PocetnaComponent},
{path: 'dokumentacija', component: DokumentacijaComponent},
{path: 'prijava', component: PrijavaComponent},
{path: 'registracija', component: RegistracijaComponent},
{path: 'profil', component: ProfilComponent , canActivate : [Guard]},
{path: 'zanrovi', component: ZanroviComponent , canActivate : [GuardAdmin]},
{path: 'filmoviPretrazivanje', component: FilmoviPretrazivanjeComponent , canActivate : [Guard]},
{path: 'filmoviPregled', component: FilmoviPregledComponent , canActivate : [Guard]},
{path: 'film/:id', component: FilmComponent , canActivate : [Guard]},
{path: 'film/:id', component: FilmComponent , canActivate : [Guard]},
{path: 'filmoviPrijedlozi', component: FilmoviPrijeloziComponent , canActivate : [GuardAdmin]},
{ path: '**', redirectTo: '/prijava' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
