import {Component, OnInit, Output} from "@angular/core";
import {VoteContainer} from "../../data-access/models/voteContainer";
import {User} from "../../data-access/models/user";
import {Router, RouterModule} from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "src/lib/data-access/authentication.service";
import {map} from "rxjs/operators"



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  @Output() username: string = "";

  password: string = "";
  userObject: User;
  helpbuttonpressed: boolean;
  loginForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {

  }

  ngOnInit(): void {

   this.loginForm = new FormGroup({
     email: new FormControl(null, [
       Validators.required,
       Validators.email,
       Validators.minLength(6)
     ]),
     password: new FormControl(null, [
       Validators.required,
       Validators.minLength(3)
     ])
   })

  }

  onSubmit() {
    if(this.loginForm.invalid) {
      return;
    }
    this.router.navigate(['main'])

    /*
    this.authService.login(this.loginForm.value).pipe(
      map(token => this.router.navigate(['main']))
    ).subscribe()
    */
  }


  setUsername(event: any): void{
    this.username = event.target.value;
  }
  setPassword(event: any):void{
    this.password = event.target.value;
  }

  submitlogin(): void{
   let userVoteContainer: VoteContainer = {name: ""};
   this.userObject= {username: this.username,password: this.password};
   //Server --> send userobject ---> server check--> send back Vote[] for userVoteContainer
  }

  presshelpbutton():void{
    this.helpbuttonpressed = true;
  }

  pressokaybutton():void{
    this.helpbuttonpressed = false;
  }
}
