import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.css']
})
export class LocationInfoComponent {
  public locationId: string = "0";

  constructor(route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.locationId = params["id"];
    });
  }
}
