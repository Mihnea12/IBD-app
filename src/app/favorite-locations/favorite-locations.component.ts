import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '../model/Location';
import { AppService } from '../service/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite-locations',
  templateUrl: './favorite-locations.component.html',
  styleUrls: ['./favorite-locations.component.css']
})
export class FavoriteLocationsComponent {

    favoriteLocations: Location[]
    dataSource : MatTableDataSource<Location>;
    selectedRowIndex:any;
    displayedColumns: string[] = ['nameLocation', 'longitude', 'latitude', 'locationType', 'rating' ];

    constructor(private appService: AppService, private router: Router) {
        this.favoriteLocations = []
        this.appService.getLocations().subscribe(response => {
            response.forEach(element => {
                this.favoriteLocations.push(new Location(element.location_id, element.name, element.longitude, element.latitude, element.type, element.rating))
            });
        })
        console.log(this.favoriteLocations)
        this.dataSource = new MatTableDataSource(this.favoriteLocations)
    }
    redirect(location: Location) {
        console.log(location)
        this.router.navigate(['/locations/' + location.location_id])
    }
    refresh() {
        this.dataSource = new MatTableDataSource(this.favoriteLocations)
    }
}
