import { Component} from "@angular/core";
import {VoteContainer} from "../data-access/voteContainer";
import {User} from "../data-access/user";
import {RouterModule} from "@angular/router";



@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent{

  username: string = "";
  password: string = "";

  setUsername(event: any): void{
    this.username = event.target.value;
  }
  setPassword(event: any):void{
    this.password = event.target.value;
  }

  submitlogin(): void{
   let userVoteContainer: VoteContainer = {name: ""};
   let userObject: User = {username: this.username,password: this.password};
    alert("Username: " +this.username + "\n" + "Password: " + this.password);
   //Server --> send userobject ---> server check--> send back Vote[] for userVoteContainer
  }
}
