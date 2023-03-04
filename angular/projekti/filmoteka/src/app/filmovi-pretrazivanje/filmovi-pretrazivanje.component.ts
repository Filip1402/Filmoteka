import { Component, OnInit } from '@angular/core';
import { FilmoviService } from '../servisi/FilmoviService';
import { FilmTMDBI } from '../servisi/FilmTMDBI';

@Component({
  selector: 'app-filmovi-pretrazivanje',
  templateUrl: './filmovi-pretrazivanje.component.html',
  styleUrls: ['./filmovi-pretrazivanje.component.sass']
})
export class FilmoviPretrazivanjeComponent implements OnInit {

  str!: number
  ukupno!: number
  filmovi: FilmTMDBI[] = new Array<FilmTMDBI>()
  kljucnaRijec: string = ""
  constructor(private filmoviService: FilmoviService) { }


  ngOnInit(): void {
    this.dohvatiFilmove(1);
  }

  async dohvatiFilmove(str: number) {
    let podaci = await this.filmoviService.dajFilmove(str, this.kljucnaRijec)
    if (podaci) {
      this.str = podaci.page;
      if (podaci.total_pages < 500)
        this.ukupno = podaci.total_pages;
      else
        this.ukupno = 500;
      this.filmovi = podaci.results;
      console.log(this.filmovi);
    }

  }

  async dodajFilm(id: number) {
    let tijelo = { "id": id }

    if (await this.filmoviService.dodaj(JSON.stringify(tijelo))) {
      alert("Film dodan u bazu!");
    }
    else {
      alert("Taj film vec postoji");
    }

  }


}
