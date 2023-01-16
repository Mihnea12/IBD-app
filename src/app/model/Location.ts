export class Location {
    locationId: string;
    nameLocation: string;
    longitude: number;
    latitude: number;
    type: string;
    rating: number;

    constructor( locationId: string, nameLocation: string,
        longitude: number, latitude: number,
        type: string, rating: number) {
        this.locationId = locationId;
        this.nameLocation = nameLocation;
        this.longitude = longitude;
        this.latitude = latitude;
        this.type = type;
        this.rating = rating;
    }
    
}