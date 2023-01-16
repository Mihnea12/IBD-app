import {Component, Input, OnInit} from '@angular/core';
import {AppService} from "../../service/app.service";

@Component({
  selector: 'app-location-visits',
  templateUrl: './location-visits.component.html',
  styleUrls: ['./location-visits.component.css']
})
export class LocationVisitsComponent implements OnInit{
  @Input()
  locationId: string = "0";

  constructor(private appService: AppService) {

  }

  ngOnInit(): void {
    this.appService.getVisitsForLocation(this.locationId).subscribe(data => {
      console.log(data);
    })
  }
}
