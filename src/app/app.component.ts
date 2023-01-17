import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from "./model/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'IBD-app';
  logged = false;
  login: boolean = false;
  user?: User;

  constructor(private router: Router) {


  }


  ngOnInit() {
    localStorage.setItem('loginBool', "false");
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

  loggedEventHandler(user: User) {
    this.logged = true;
    this.user = user;
  }

  logout() {
    this.logged = false;
    this.user = undefined;
    localStorage.removeItem('user_id');
    localStorage.removeItem('first_name');
    localStorage.removeItem('last_name');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('loginBool');
    this.router.navigate(["/"]);
  }
}
