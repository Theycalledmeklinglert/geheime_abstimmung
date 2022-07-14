import { Component, OnInit } from '@angular/core';

import { UsersContainer } from '../../data-access/models/usersContainer';
import {users} from "../../data-access/models/users";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'userContainer',
  templateUrl: './UserContainer.component.html',
  styleUrls: ['./UserContainer.component.css'],
})
export class UserConainterComponent implements OnInit{
  ucobject?: UsersContainer;
  newListIndex?: number;
  sureDeleteUsers: boolean = false;
  tempUsers: users;

  //icons
  sucesssend: boolean = false;
  failsend: boolean = false;

  constructor(private backendService: BackendService, private authService: AuthenticationService) {}



  ngOnInit(): void{
    this.ucobject = {name:"testcontainer", users:[] };
    this.backendService.loadAllUseryBySysadmin().subscribe((response) =>{
      this.ucobject.users = response["users"];
      this.authService.updateSessionid(response["Session ID"]);

    });
  }



  setVotes(users: users[]){
    this.ucobject.users = users;
  }

  realydelete(user: users){
    this.sureDeleteUsers = true;
    this.tempUsers = user;
  }

  yessDelete(){
    this.ucobject.users = this.ucobject.users.filter(v => v != this.tempUsers);


    let userData = '{"name" :"'+localStorage.getItem("userName")+ '", "role" :"'+localStorage.getItem("userRole")+'"}';

    try {
      this.backendService.deleteUser(this.tempUsers.name).subscribe((response) =>{
        this.authService.updateSessionid(response["Session ID"]);
        this.sureDeleteUsers = false;
        this.sucesssend = true;
        setTimeout(() => { this.sucesssend = false;}, 1500);
      }, error => {
        this.authService.updateSessionid(error.error["Session ID"]);
        this.failsend = true;
        this.sureDeleteUsers = false;
        setTimeout(() => { this.failsend = false;}, 1300);

      });
    }catch (err){}





  }

  noSkipDelete(){
    this.tempUsers = null;
    this.sureDeleteUsers = false;
  }

  deleteUser(user: users){
    this.realydelete(user);
  }

}
