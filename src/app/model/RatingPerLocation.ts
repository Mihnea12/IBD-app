export class RatingPerLocation {
  location: string;
  avg_rating: number;

  constructor(location:string, rating: number) {
    this.location = location;
    this.avg_rating = rating;
  }
}
