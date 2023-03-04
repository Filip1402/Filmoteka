import { Component, OnInit } from '@angular/core';
import { FilmI } from '../servisi/FilmI';
import { pocetnaService } from '../servisi/pocetnaService';
import { ZanrI } from '../servisi/ZanrI';
import { ZanroviService } from '../servisi/ZanroviService';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.sass'],
})
export class PocetnaComponent implements OnInit {

  zanrovi!: Array<ZanrI>
  filmovi!: Array<Array<FilmI>>


  constructor(private pocetnaService: pocetnaService, private zanroviService: ZanroviService) {
    this.filmovi = new Array<Array<FilmI>>();
  }
  ngOnInit(): void {

    //this.dajZanrove();
    this.dohvatiZanroveIzBaze();
  }

  /*async dajZanrove() {
    console.log("getZanrovi")
    this.zanrovi = await this.pocetnaService.dohvatiZanrove();
    for (let zanr of this.zanrovi) {
      this.filmovi.push((await this.dajFilmove(zanr))!!)
    }
    console.log(this.filmovi);
  }*/

  async dohvatiZanroveIzBaze() {
    let podaci = await this.zanroviService.getZanrovi(false);
    if (podaci != undefined) {
      this.zanrovi = podaci;
      for (let zanr of this.zanrovi) {
        this.filmovi.push((await this.dajFilmove(zanr))!!)
      }
    }

  }

  async dajFilmove(zanr: ZanrI) {
    return await this.pocetnaService.dohvatiFilmove(zanr);
  }
}


