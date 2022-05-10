import {Component, Output} from "@angular/core";
import {VoteContainer} from "../../data-access/models/voteContainer";
import {User} from "../../data-access/models/user";
import {RouterModule} from "@angular/router";
import {AppComponent} from "../../../app/app.component";
import {AppModule} from "../../../app/app.module";



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent{

  @Output()username: string = "";
  password: string = "";
  userObject: User;
  helpbuttonpressed: boolean;

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
