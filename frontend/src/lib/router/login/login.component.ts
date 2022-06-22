import {Component, Output} from "@angular/core";
import {SurveyLeader} from "../../data-access/models/surveyLeader";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../data-access/service/authentication.service";



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {

  @Output()userEmail: string = "";
  password: string = "";
  userObject: SurveyLeader;
  helpbuttonpressed: boolean;
  correctUserdata: boolean = true;
  constructor(private authService: AuthenticationService, private router: Router) {}

  showloadingstatus: boolean = false;

  wrongUsernameorPassword: boolean = false;

  setUsername(event: any): void{
    this.userEmail = event.target.value;
  }
  setPassword(event: any):void{
    this.password = event.target.value;
  }

  submitlogin(e:any){

    if(this.userEmail != "" && this.password != ""){

      this.showloadingstatus = true;
      e.preventDefault();

      this.authService.getAuthUser(this.userEmail.toLowerCase(),this.password).subscribe({
        next: response => {
          console.log(response);
          localStorage.setItem('sessionID', response['Session ID']);
          localStorage.setItem("userEmail", this.userEmail);
          localStorage.setItem("userPassword", this.password);
          localStorage.setItem("userName",response["userName"]);
          localStorage.setItem("userRole",response["role"]);
          console.log(localStorage.getItem("userRole"));

          this.router.navigateByUrl('/main')
        },
        error: error => {
          console.log(error)
          this.showloadingstatus = false;
          this.wrongUsernameorPassword = true;
        }

      });
    }
    else {
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
