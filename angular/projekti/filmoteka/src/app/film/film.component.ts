import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmDetaljiI } from '../servisi/FilmDetaljiI';
import { FilmI } from '../servisi/FilmI';
import { FilmoviService } from '../servisi/FilmoviService';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.sass']
})
export class FilmComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router, private filmoviService: FilmoviService) { }
  id!: number
  filmDetalji!: FilmDetaljiI
  extension: string =".jpg"
  ngOnInit() {
    let param = this.route.snapshot.paramMap.get('id');
    if (param != undefined || param != null) {
      this.id = parseInt(param);
      this.daj();

    }
    else
      this.router.navigate(["/pocetna"]);

  }

  async daj() {
    console.log("here");
    let odg = await this.filmoviService.dajFilm(this.id);
    if (odg)
      this.filmDetalji = odg;
    else
      this.router.navigate(["/pocetna"]);
      


  }



}
