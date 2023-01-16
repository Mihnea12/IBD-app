import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../model/User";
import {Auth} from "../model/Auth";
import {Visits} from "../model/Visits";
import {Prices} from "../model/Prices";
import {RatingPerLocation} from "../model/RatingPerLocation";
import { Location } from "../model/Location"

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private URL: string;

  constructor(private http: HttpClient) {
    //TODO Backend Address
    this.URL = 'https://3c519289-75b3-47da-800b-aff1507b3ac7.mock.pstmn.io';
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
    let visitsURL = this.URL + '/visits';
    return this.http.get<Visits[]>(visitsURL);
  }

  public getPrices() {
    //TODO Add path
    let pricesURL = this.URL + '/prices';
    return this.http.get<Prices[]>(pricesURL);
  }

  public getRatings() {
    //TODO Add path
    let ratingsURL = this.URL + '/rating';
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
    let visitsURL = this.URL + '/visits/' + locationId;
    return this.http.get<Date[]>(visitsURL);
  }

}
