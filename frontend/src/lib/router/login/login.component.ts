import {Component, Output} from "@angular/core";
import {SurveyLeader} from "../../data-access/models/surveyLeader";
import {Router, RouterModule} from "@angular/router";
import {AuthenticationService} from "../../data-access/service/authentication.service";



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

  showloadingstatus: boolean = false;

  wrongUsernameorPassword: boolean = false;

  setUsername(event: any): void{
    this.userEmail = event.target.value;
  }
  setPassword(event: any):void{
    this.password = event.target.value;
  }

  async submitlogin(): Promise<void>{
    if(this.userEmail != "" && this.password != ""){
      this.showloadingstatus = true;
      console.log("login with"+ this.password+ ","+this.userEmail)
      try {
        let sucesslogin = await this.authService.getSessionid(this.userEmail,this.password);
        if (sucesslogin){

          this.router.navigate(['/main']);
          console.log("LoginComponent->"+"KEY: " + localStorage.getItem("sessionID"));
          localStorage.setItem("userEmail",this.userEmail);
          localStorage.setItem("userPassword", this.password);
        }

      }catch (err){
        console.log("ERROR invalid SessionKey!");
        this.showloadingstatus = false;
        this.wrongUsernameorPassword = true;
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
