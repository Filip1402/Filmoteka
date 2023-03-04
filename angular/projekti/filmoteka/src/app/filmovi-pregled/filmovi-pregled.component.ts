import { Component, OnInit } from '@angular/core';
import { FilmI } from '../servisi/FilmI';
import { FilmoviService } from '../servisi/FilmoviService';
import { ZanrI } from '../servisi/ZanrI';
import { ZanroviService } from '../servisi/ZanroviService';

@Component({
  selector: 'app-filmovi-pregled',
  templateUrl: './filmovi-pregled.component.html',
  styleUrls: ['./filmovi-pregled.component.sass']
})
export class FilmoviPregledComponent implements OnInit {

  filmovi!: FilmI[]
  zanrovi!: ZanrI[]
  str!: number
  ukupno!: number
  sort!: string
  datum!: string
  filterZanr!: string

  constructor(private filmoviService: FilmoviService, private zanroviService: ZanroviService) { }

  ngOnInit(): void {
    this.dohvatiFilmove();
  }

  async dohvatiFilmove(str: number = 1) {
    await this.dohvatiZanroveIzBaze();
    let z : any = this.zanrovi.find(zanr => zanr.naziv == this.filterZanr)?.id_tmdb;
    if (z != undefined)
      z = z.toString();


    let podaci = await this.filmoviService.dajFilmovePremaParametrima(str, z, this.datum, this.sort);
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

  onSortSelected(e: Event) {
    this.dohvatiFilmove();
  }

}
