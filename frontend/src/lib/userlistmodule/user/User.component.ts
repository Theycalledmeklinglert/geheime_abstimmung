import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {users} from "../../data-access/models/users";
import {BackendService} from "../../data-access/service/backend.service";
import {Router} from "@angular/router";

import {AuthenticationService} from "../../data-access/service/authentication.service";

@Component({
  selector: 'user',
  templateUrl: './User.component.html',
  styleUrls: ['./User.component.css'],
})
export class UserComponent {
  @Input() userObject: users;
  result: String = "";

  @Output()
  deleteUserEvent = new EventEmitter<users>();

  constructor (private backendService: BackendService, private router: Router, private authService: AuthenticationService) {}

  showVoteName(): String{
    return this.userObject.email;
  }


  isSysadmin(): String{
   if(this.userObject.role == "admin"){this.result = "Y"}
   else {this.result = "N"}


    return this.result;
  }


  deletethisUser(): void{

    this.deleteUserEvent.emit(this.userObject);
  }



}
