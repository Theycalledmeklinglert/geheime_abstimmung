import {Component, Input} from '@angular/core';
import {LoginComponent} from "../lib/router/login/login.component";
import {BackendService} from "../lib/data-access/backend.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  currentuser: string = "";
  firststart : boolean;
  backendS: BackendService = new BackendService();
  constructor() {
    localStorage.removeItem("sessionid");
    localStorage.removeItem("backendpublickey");
  }

  getusername(): String{
    //return this.loggedInUser.username;
    this.currentuser = this.backendS.getUsernameofsurveyLeader();
    return this.currentuser;
  }


}
