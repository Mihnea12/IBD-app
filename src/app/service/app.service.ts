import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {Auth} from "../model/Auth";
import { Location } from "../model/Location"

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private URL: string;

  constructor(private http: HttpClient) {
    //TODO Backend Address
    this.URL = 'http://localhost:8081';
  }

  public register(user: User) {
    let registerURL = this.URL + '/entities/users';
    this.http.post(registerURL, user).subscribe(response => {
      console.log(response);
    });
  }

  public login(auth: Auth){
    let loginURL = this.URL + '/login';
    return this.http.post<User>(loginURL, auth);
  }

  public addFavorites(place: Location) {
    let locationURL = this.URL + '/entities/locations'
    this.http.post(locationURL, place).subscribe(response => {
        console.log(response)
    })
  }

}
