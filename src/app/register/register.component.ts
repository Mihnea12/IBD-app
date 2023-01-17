import { Component } from '@angular/core';
import {AppService} from "../service/app.service";
import {User} from "../model/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  loginBool: boolean = false;

  registerUser: User = new User("","","", "", "", "", 0, "");

  constructor(private appService: AppService, public router: Router) {
    this.loginBool = localStorage.getItem('loginBool') == 'true';
    console.log(this.loginBool)
  }

  onClickSubmit() {
    console.log(this.registerUser.username);
    this.appService.register(this.registerUser);
    this.router.navigate(['login']);
  }
}
