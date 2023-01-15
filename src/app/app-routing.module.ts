import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GoogleMapComponent} from './google-demo/google-demo.component';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import { FavoriteLocationsComponent } from './favorite-locations/favorite-locations.component';

const routes: Routes = [
  {path: 'map', component: GoogleMapComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'locations', component: FavoriteLocationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
