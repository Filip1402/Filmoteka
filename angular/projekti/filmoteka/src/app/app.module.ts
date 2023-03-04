import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigacijaComponent } from './navigacija/navigacija.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { ProfilComponent } from './profil/profil.component';
import { ZanroviComponent } from './zanrovi/zanrovi.component';
import { FilmoviPretrazivanjeComponent } from './filmovi-pretrazivanje/filmovi-pretrazivanje.component';
import { FilmoviPregledComponent } from './filmovi-pregled/filmovi-pregled.component';
import { FilmComponent } from './film/film.component';
import { FilmoviPrijeloziComponent } from './filmovi-prijelozi/filmovi-prijelozi.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigacijaComponent,
    PocetnaComponent,
    DokumentacijaComponent,
    PrijavaComponent,
    RegistracijaComponent,
    ProfilComponent,
    ZanroviComponent,
    FilmoviPretrazivanjeComponent,
    FilmoviPregledComponent,
    FilmComponent,
    FilmoviPrijeloziComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
