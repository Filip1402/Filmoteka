import { FilmI } from "./FilmI";
import { KorsinikI } from "./KorisnikI";
import { ZanrI } from "./ZanrI";

export interface FilmDetaljiI
{
    film : FilmI
    korisnik : KorsinikI
    zanrovi : ZanrI[]
}