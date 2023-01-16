import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { Visit } from '../model/Visit';
import { AppService } from '../service/app.service';

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.css']
})
export class LocationInfoComponent {
  public locationId: string = "0";
  visit: Visit;

  constructor(route: ActivatedRoute, private appService: AppService) {
    this.visit = new Visit('', '', '', '', 0, 0)
    route.params.subscribe((params) => {
      this.locationId = params["id"];
    });
  }

  addVisit() {
    if(document.getElementById('review')!.style.display == "none")
        document.getElementById('review')!.style.display = "block"
    else
        document.getElementById('review')!.style.display = "none"
  }

  submitVisit() {
    this.visit.location_id = this.locationId;
    this.visit.user_id = localStorage.getItem('user_id')!;
    this.visit.spending = Number((<HTMLInputElement>document.getElementById('cash')).value);
    this.visit.comment = (<HTMLInputElement>document.getElementById('comment')).value;
    this.visit.date_time = (<HTMLInputElement>document.getElementById('date')).value;
    this.visit.rating = Number((<HTMLInputElement>document.getElementById('rating')).value);
    console.log(this.visit)
    this.appService.addVisit(this.visit);
  }
}
