export class Visit{
    user_id: string;
    location_id: string;
    date_time: string;
    comment: string;
    rating: number;
    spending: number;
  
    constructor(location_id: string, user_id: string, date_time: string, comment: string, rating: number, spending: number) {
      this.location_id = location_id;
      this.user_id = user_id;
      this.date_time = date_time;
      this.comment = comment;
      this.rating = rating;
      this.spending = spending;
    }
  }
  