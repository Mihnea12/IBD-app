import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoogleMapComponent} from './google-demo/google-demo.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {GeneralStatisticsComponent} from "./general-statistics/general-statistics.component";
import { FavoriteLocationsComponent } from './favorite-locations/favorite-locations.component';
import {LocationInfoComponent} from "./location-info/location-info.component";

const routes: Routes = [
  {path: 'map', component: GoogleMapComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'general-statistics', component: GeneralStatisticsComponent},
  {path: 'locations', component: FavoriteLocationsComponent},
  {path: "locations/:id", component: LocationInfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
