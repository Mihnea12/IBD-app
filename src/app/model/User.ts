export class User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  username: string;
  age: number;
  occupation: string;

  constructor( user_id: string, username: string, password: string,
               firstName: string, lastName: string,
               email: string, age: number, occupation:string) {
    this.user_id = user_id;
    this.username = username;
    this.password = password;
    this.first_name = firstName;
    this.last_name = lastName;
    this.email = email;
    this.occupation = occupation;
    this.age = age;
  }
}
