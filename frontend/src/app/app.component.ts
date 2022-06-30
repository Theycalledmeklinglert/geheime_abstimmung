import {Component, Input} from '@angular/core';
import {LoginComponent} from "../lib/router/login/login.component";
import {BackendService} from "../lib/data-access/service/backend.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  currentuser: string = "";
  showUsericon : boolean = false;
  connectionIsLost: boolean = false;

  constructor() {
  }

  getUsername(): string{
    if(localStorage.getItem("userName") == null){
      return "";
    }else {
      return localStorage.getItem("userName");
    }
  }

  isLoggedIn():void{
    this.showUsericon = localStorage.getItem("userName") != null
  }


}
