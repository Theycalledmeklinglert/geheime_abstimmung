import {Component, Output} from "@angular/core";
import {VoteContainer} from "../../data-access/models/voteContainer";
import {SurveyLeader} from "../../data-access/models/surveyLeader";
import {Router, RouterModule} from "@angular/router";
import {AppComponent} from "../../../app/app.component";
import {AppModule} from "../../../app/app.module";
import {AuthenticationService} from "../../data-access/service/authentication.service";



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent{

  @Output()username: string = "";
  password: string = "";
  userObject: SurveyLeader;
  helpbuttonpressed: boolean;
  correctUserdata: boolean = true;
  constructor(private authService: AuthenticationService, private router: Router) {
  }


  setUsername(event: any): void{
    this.username = event.target.value;
  }
  setPassword(event: any):void{
    this.password = event.target.value;
  }

  submitlogin(): void{
    localStorage.removeItem("sessionid");
    localStorage.removeItem("backendpublickey");
    if(this.username != "" && this.password != ""){
      if (this.correctUserdata){
        this.router.navigate(['/main']);
      }

      this.authService.getSessionid(this.username,this.password);

    }else {
      alert("Emailadress or Password is empty!");
    }
  }

  presshelpbutton():void{
    this.helpbuttonpressed = true;
  }

  pressokaybutton():void{
    this.helpbuttonpressed = false;
  }


}
