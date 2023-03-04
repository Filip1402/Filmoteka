import { FilmTMDBI } from "./FilmTMDBI"

export interface DiscoverMoviesI
{
    page : number
    results : FilmTMDBI[]
    total_pages : number
    total_results : number
}