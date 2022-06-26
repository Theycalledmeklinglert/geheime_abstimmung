import {Component, EventEmitter, Input, Output} from "@angular/core";
import {SurveyLeader} from "../../data-access/models/surveyLeader";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {users} from "../../data-access/models/users";



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent {

  @Output()
  serverError = new EventEmitter<boolean>();
  @Output()userEmail: string = "";
  password: string = "";
  userObject: SurveyLeader;
  helpbuttonpressed: boolean;
  correctUserdata: boolean = true;
  showloadingstatus: boolean = false;
  wrongUsernameorPassword: boolean = false;
  timeout: boolean = false;
  timeoutTime: string = "";
  serverproblems: boolean = false;
  atmepts: number = 5;


  constructor(private authService: AuthenticationService, private router: Router) {}



  setUsername(event: any): void{
    this.userEmail = event.target.value;
  }
  setPassword(event: any):void{
    this.password = event.target.value;
  }

  submitlogin(e:any){

    if(this.userEmail != "" && this.password != ""){
      this.serverproblems= false;
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
          if(error.status == 401 || error.status == 403 ){
            if(error.status == 401){
              this.wrongUsernameorPassword = true;
              console.log("Attempt: "+error.error["attempt"])
              this.timeout = false;
              this.atmepts = 5 - error.error["attempt"]
              if(this.atmepts == 0) this.timeout = true;
            }else {
              this.wrongUsernameorPassword = true;
              console.log(error.status);
              this.timeout =  true;
              this.timeoutTime =  "Timout for "+error.error["Timeout Duration in Minutes"]+ " Minutes!";
              console.log("TimeoutTime"+error.error["Timeout Duration in Minutes"])
            }

          }else {
            this.timeout == false;
            this.serverError.emit(true);
            this.serverproblems = true;
          }

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

  getAttemptsOrTimeout(): string{
    if(this.timeout)return this.timeoutTime;
    return "Remaining ("+this.atmepts+"/5)";
  }






}
