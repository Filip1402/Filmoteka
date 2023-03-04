export class DatumService {

    prikaziDatum(podaci: Date) {
        let datum_baza = new Date(podaci);
        let datum = datum_baza.getFullYear() + '-';
        if (datum_baza.getMonth() + 1 < 10)
            datum += '0' + (datum_baza.getMonth() + 1);
        else datum += datum_baza.getMonth() + 1;
        if (datum_baza.getDate() < 10) datum += '-' + '0' + datum_baza.getDate();
        else datum += '-' + datum_baza.getDate();
        return datum;
    }
}
