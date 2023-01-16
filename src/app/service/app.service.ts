import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {Auth} from "../model/Auth";
import {Visits} from "../model/Visits";
import {Prices} from "../model/Prices";
import {RatingPerLocation} from "../model/RatingPerLocation";
import { Location } from "../model/Location"
import { Visit } from '../model/Visit';

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

  public login(auth: Auth) {
    let loginURL = this.URL + '/login';
    return this.http.post<User>(loginURL, auth);
  }

  public getVisits() {
    //TODO Add path
    let visitsURL = this.URL + '/visits/count';
    return this.http.get<Visits[]>(visitsURL);
  }

  public getPrices() {
    //TODO Add path
    let pricesURL = this.URL + '/visits/spending';
    return this.http.get<Prices[]>(pricesURL);
  }

  public getRatings() {
    //TODO Add path
    let ratingsURL = this.URL + '/visits/ratings';
    return this.http.get<RatingPerLocation[]>(ratingsURL);
  }

  public addFavorites(place: Location) {
    let locationURL = this.URL + '/entities/locations'
    this.http.post(locationURL, place).subscribe(response => {
        console.log(response)
    })
  }

  public getLocations() {
    let locationURL = this.URL + '/entities/locations'
    return this.http.get<Location>(locationURL)
  }

  public getVisitsForLocation(locationId: string){
    let visitsURL = this.URL + '/visits/timestamps' + locationId;
    return this.http.get<Date[]>(visitsURL);
  }

  public addVisit(visit: Visit) {
    let visitURL = this.URL + '/entities/user/visits'
    this.http.post(visitURL, visit).subscribe(response => {
      console.log(response)
    })
  }

}
