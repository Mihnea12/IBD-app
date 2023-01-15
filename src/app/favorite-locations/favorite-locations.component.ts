import { Component } from '@angular/core';
import { Location } from '../model/Location';
import { AppService } from '../service/app.service';

@Component({
  selector: 'app-favorite-locations',
  templateUrl: './favorite-locations.component.html',
  styleUrls: ['./favorite-locations.component.css']
})
export class FavoriteLocationsComponent {

    favoriteLocations: Location[]

    constructor(private appService: AppService) {
        this.favoriteLocations = []
    }
    ngOnInit() {
        this.appService.getLocations().subscribe(response => {
            console.log(response)
        })
    }
}
