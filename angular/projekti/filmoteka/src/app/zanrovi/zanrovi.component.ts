import { Component, OnInit } from '@angular/core';
import { ZanrI } from '../servisi/ZanrI';
import { ZanroviService } from '../servisi/ZanroviService';
import { ZanrTMDBI } from '../servisi/ZanrTMDBI';

@Component({
  selector: 'app-zanrovi',
  templateUrl: './zanrovi.component.html',
  styleUrls: ['./zanrovi.component.sass']
})
export class ZanroviComponent implements OnInit {

  zanrovi_iz_baze: Array<ZanrI>
  zanroviTMDB: Array<ZanrTMDBI>
  checkbox_zanrovi = Array<ZanrTMDBI>()
  selectedOption! : string
  noviNaziv! : string

  constructor(private zanroviService: ZanroviService) {
    this.zanrovi_iz_baze = new Array<ZanrI>();
    this.zanroviTMDB = new Array<ZanrTMDBI>();
  }

  ngOnInit(): void {
    this.dohvatiZanroveIzBaze();
  }

  async dohvatiZanroveIzBaze() {
    let zanrovi = await this.zanroviService.getZanrovi();
    if (zanrovi != undefined) {

      this.zanrovi_iz_baze = zanrovi;
      console.log(this.zanrovi_iz_baze);
    }
  }


  async dohvatiZanroveTMDB() {
    let zanr = await this.zanroviService.getZanroviTMDB();
    if (zanr != undefined) {
      this.zanroviTMDB = zanr;
    }
  }


  onCheckboxChange(e: Event) {
    if ((e.target as HTMLInputElement).checked) {
      this.checkbox_zanrovi.push({ id: parseInt((e.target as HTMLInputElement).id), name: (e.target as HTMLInputElement).value });
      console.log(this.checkbox_zanrovi);
    }
    else {
      const index = this.checkbox_zanrovi.findIndex(x => x.id === parseInt((e.target as HTMLInputElement).id));
      this.checkbox_zanrovi.splice(index);
      console.log(this.checkbox_zanrovi);
    }
  }



  async dodaj() {
    if (this.checkbox_zanrovi.length == 0)
      return;
    for (let zanr of this.checkbox_zanrovi) {
      let tijelo = {
        naziv: zanr.name,
        id_tmdb: zanr.id
      }
      alert(await this.zanroviService.dodajZanr(JSON.stringify(tijelo)));

    }
    this.dohvatiZanroveIzBaze();
  }

  async izbrisi(){
    if(await this.zanroviService.IzbrisiZanrove() == true)
      this.dohvatiZanroveIzBaze();
  }

  async azuriraj()
  {
    console.log(this.selectedOption);
    if(this.noviNaziv=="" || this.selectedOption == "")
      return
    let tijelo ={
      naziv : this.noviNaziv
    }
    if(await this.zanroviService.azurirajZanr(JSON.stringify(tijelo),parseInt(this.selectedOption)) == true)
      this.dohvatiZanroveIzBaze();
  }





}
