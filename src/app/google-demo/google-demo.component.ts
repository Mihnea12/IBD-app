import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

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

  constructor(private ngZone: NgZone) {
  }

  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLng[] = [];

  addMarker(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
    {
        this.markerPositions = [];
        this.markerPositions.push(event.latLng);
    }
  }

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    // this.map = new google.maps.Map(document.getElementById('map')!);
    console.log(this.map)
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

        var markerLocation = new google.maps.LatLng(this.latitude,this.longitude)
        this.markerPositions.push(markerLocation);

        this.map.fitBounds(autocomplete.getPlace().geometry!.viewport!);
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

}
