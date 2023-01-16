import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../service/app.service';
import { Location } from '../model/Location';

export interface Review {
    nameUser: string;
    text: string;
    rating: number;
    relativeTime: string;
  }

@Component({
  selector: 'map',
  templateUrl: './google-demo.component.html',
  styleUrls: ['./google-demo.component.css']
})
export class GoogleMapComponent implements OnInit {

  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild(GoogleMap)
  public map!: GoogleMap;

  zoom = 12;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDefaultUI: true,
    fullscreenControl: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
  };
  latitude!: any;
  longitude!: any;
  reviews!: any;
  data!: any;
  currentPlace !: any;
  favoriteLocation: Location = new Location("", "", 0, 0, "", 0);

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLng[] = [];

  displayedColumns: string[] = ['nameUser', 'text', 'rating', 'relativeTime' ];
  dataReviews : Review[];
  dataSource : MatTableDataSource<Review>;

  constructor(private ngZone: NgZone, private appService: AppService) {
    this.dataReviews = [];
    this.dataSource = new MatTableDataSource(this.dataReviews);
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
    {
        this.markerPositions = [];
        this.markerPositions.push(event.latLng);
    }
  }

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
    // Align search box to center
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(
      this.searchElementRef.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //clear markers
        this.markerPositions = []

        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();
        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };
        this.currentPlace = place;
        console.log(this.currentPlace)
        var markerLocation = new google.maps.LatLng(this.latitude,this.longitude)
        this.markerPositions.push(markerLocation);

        this.map.fitBounds(autocomplete.getPlace().geometry!.viewport!);
        
        this.reviews = place.reviews
        this.reviews.forEach((review: any) => {
            var newReview = {
                nameUser: review.author_name,
                text: review.text,
                rating: review.rating,
                relativeTime: review.relative_time_description
            }
            this.dataReviews.push(newReview)
        });
        this.dataSource = new MatTableDataSource(this.dataReviews);
      });
    });
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  addReview() {
    if(document.getElementById('review')!.style.display == "none")
        document.getElementById('review')!.style.display = "block"
    else
        document.getElementById('review')!.style.display = "none"
  }

  addtoFavorites() {
      document.getElementById('status')!.style.display = "block"
      this.favoriteLocation.name = this.currentPlace.name;
      this.favoriteLocation.location_id = this.currentPlace.place_id;
      this.favoriteLocation.latitude = this.currentPlace.geometry.location?.lat();
      this.favoriteLocation.longitude = this.currentPlace.geometry.location?.lng();
      this.favoriteLocation.rating = this.currentPlace.rating;
      this.favoriteLocation.type = this.currentPlace.types![0];
      this.appService.addFavorites(this.favoriteLocation)

      setTimeout(() => {
        document.getElementById('status')!.style.display = "none"
      }, 3000)
  }
}
