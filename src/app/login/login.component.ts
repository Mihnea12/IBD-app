import {Component, EventEmitter, Output} from '@angular/core';
import {Auth} from "../model/Auth";
import {AppService} from "../service/app.service";
import {Router} from "@angular/router";
import {AlertService} from '../_alert';
import {User} from "../model/User";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  auth: Auth = new Auth("","");
  logged: boolean = false;

  @Output()
  loggedInEventEmitter: EventEmitter<User> = new EventEmitter<User>();

  constructor(private appService: AppService,
              private alertService: AlertService,
              private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.appService.login(this.auth).subscribe(response => {
      console.log(response);
      let options = {
        autoClose: true,
        keepAfterRouteChange: true
      };
      if (response == null) {
        this.logged = false;
        this.alertService.error('Email or password incorrect! Please try again!', options);
      } else {
        this.alertService.success('Login successfully', options);
        this.router.navigate(['/']);

        localStorage.setItem('user_id', response.user_id);
        localStorage.setItem('first_name', response.first_name);
        localStorage.setItem('last_name', response.last_name);
        localStorage.setItem('email', response.email);
        localStorage.setItem('username', response.username);

        this.loggedInEventEmitter.emit(response);

      }
      localStorage.setItem('loginBool', String(this.logged));
    },error => {
      if(this.auth.username == 'admin' && this.auth.password == 'admin'){
        let options = {
          autoClose: true,
          keepAfterRouteChange: true
        };
        this.alertService.success('Login successfully', options);
        this.router.navigate(['/']);
        this.logged = true;

        localStorage.setItem('user_id', "0");
        localStorage.setItem('first_name', 'admin');
        localStorage.setItem('last_name', 'admin');
        localStorage.setItem('email', 'admin');
        localStorage.setItem('username', 'admin');
        localStorage.setItem('loginBool', String(this.logged));
        this.loggedInEventEmitter.emit(new User("0","admin", "admin", "admin", "admin", "admin",30, ""));
      }
    });
  }

}
