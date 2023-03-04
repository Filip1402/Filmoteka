import { Component, OnInit } from '@angular/core';
import { FilmI } from '../servisi/FilmI';
import { FilmoviService } from '../servisi/FilmoviService';
import { ZanrI } from '../servisi/ZanrI';
import { ZanroviService } from '../servisi/ZanroviService';

@Component({
  selector: 'app-filmovi-prijelozi',
  templateUrl: './filmovi-prijelozi.component.html',
  styleUrls: ['./filmovi-prijelozi.component.sass']
})
export class FilmoviPrijeloziComponent implements OnInit {

  filmovi!: FilmI[]
  zanrovi!: ZanrI[]
  str!: number
  ukupno!: number

  constructor(private filmoviService : FilmoviService, private zanroviService: ZanroviService){}

  ngOnInit(): void {
    this.dohvatiFilmove();
  }

  async dohvatiFilmove(str : number = 1){
    await this.dohvatiZanroveIzBaze();



    let podaci = await this.filmoviService.dajFilmovePremaParametrima(str,"","","",false);
    if (podaci) {
      this.str = podaci.stranica;
      this.ukupno = podaci.br_stranica;
      this.filmovi = podaci.rezultat;
      console.log(this.filmovi);
  }
}

  async dohvatiZanroveIzBaze() {
    let z = await this.zanroviService.getZanrovi();
    if (z != undefined) {
      this.zanrovi = z;
    }
  }

  async Odobri(id : number){
    let film = this.filmovi.find(f=>f.id == id);
    if(!film) return;
    if(await this.filmoviService.OdobriFilm(film))
      this.dohvatiFilmove();
    else
      alert("Greška u dodavanju!");
  }

  async Brisi(id : number){
    let film = this.filmovi.find(f=>f.id == id);
    if(!film) return;
    if(await this.filmoviService.BrisiFilm(film))
      this.dohvatiFilmove();
  }
}
