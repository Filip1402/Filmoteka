import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JWTService {
  constructor() {}

  async dajJWT() : Promise<RequestInit | undefined> {
    let jwt_odg = await fetch('/getJWT');
    if (jwt_odg.status == 200) {
      let jwt = await jwt_odg.json();
      //console.log(jwt);
      //jwt = JSON.parse(jwt);
      //console.log(jwt.ok);
      let zaglavlje = new Headers();
      zaglavlje.set('Authorization', jwt.ok);
      let parametri = { headers: zaglavlje };
      return parametri;
    }
    return undefined;
  }
}
