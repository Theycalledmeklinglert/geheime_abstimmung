import {Component, Input} from '@angular/core';
import {LoginComponent} from "../lib/router/login/login.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  currentuser: string = "Max Mustermann";
  firststart : boolean;
  constructor() {
    localStorage.removeItem("sessionid");
    localStorage.removeItem("backendpublickey");
  }

  getusername(): String{
    //return this.loggedInUser.username;
    this.currentuser = localStorage.getItem("sessionid");
    return this.currentuser;
  }

}
