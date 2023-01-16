export class Location {
    location_id: string;
    name: string;
    longitude: number;
    latitude: number;
    type: string;
    rating: number;

    constructor( location_id: string, name: string,
        longitude: number, latitude: number,
        type: string, rating: number) {
        this.location_id = location_id;
        this.name = name;
        this.longitude = longitude;
        this.latitude = latitude;
        this.type = type;
        this.rating = rating;
    }
    
}