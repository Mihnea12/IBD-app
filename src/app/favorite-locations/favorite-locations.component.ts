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
    displayedColumns: string[] = ['idLocation', 'nameLocation', 'longitude', 'latitude', 'locationType', 'rating' ];

    constructor(private appService: AppService, private router: Router) {
        this.favoriteLocations = []
        this.favoriteLocations.push(new Location('id1','locatie',1,2,'tip',5))
        this.favoriteLocations.push(new Location('id2','locatie',1,2,'tip',5))
        this.favoriteLocations.push(new Location('id3','locatie',1,2,'tip',5))
        this.favoriteLocations.push(new Location('id4','locatie',1,2,'tip',5))
        this.favoriteLocations.push(new Location('id5','locatie',1,2,'tip',5))
        this.dataSource = new MatTableDataSource(this.favoriteLocations)
    }
    ngOnInit() {
        this.appService.getLocations().subscribe(response => {
            console.log(response)
        })
    }
    redirect(location: Location) {
        console.log(location)
        this.router.navigate(['/locations/' + location.locationId])
    }
}
