import {Component, Output} from "@angular/core";
import {VoteContainer} from "../../data-access/models/voteContainer";
import {SurveyLeader} from "../../data-access/models/surveyLeader";
import {Router, RouterModule} from "@angular/router";
import {AppComponent} from "../../../app/app.component";
import {AppModule} from "../../../app/app.module";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {timeout} from "rxjs";



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent{

  @Output()userEmail: string = "";
  password: string = "";
  userObject: SurveyLeader;
  helpbuttonpressed: boolean;
  correctUserdata: boolean = true;
  constructor(private authService: AuthenticationService, private router: Router) {
  }


  setUsername(event: any): void{
    this.userEmail = event.target.value;
  }
  setPassword(event: any):void{
    this.password = event.target.value;
  }

  submitlogin(): void{
    if(this.userEmail != "" && this.password != ""){

      console.log("login with"+ this.password+ ","+this.userEmail)
      let sucesslogin = this.authService.getSessionid(this.userEmail,this.password);
      if (sucesslogin){

        this.router.navigate(['/main']);
        console.log("LoginComponent->"+"KEY: " + localStorage.getItem("sessionID"));
        localStorage.setItem("userEmail",this.userEmail);

      }else {
        console.log("ERROR invalid SessionKey!");
      }

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
