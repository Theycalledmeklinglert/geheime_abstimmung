import { Component} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";



@Component({
  selector: 'mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
})

export class MainmenuComponent{

  //SysAdmin?
  isSysAdmin: boolean = true;

  //Formula
  addAdmin: boolean;
  deleteAdmin:boolean;
  changePassword: boolean;
  changeUsername: boolean;

  //
  sureAddAdmin: boolean;
  sureDeleteAdmin: boolean;
  sureChangePassword: boolean;
  sureChangeUsername: boolean;

  //change Password
  changedPassword: string= "";

  //change Username
  changedUsername: string= "";



  //new Admin
  newadminadress: string = "";
  newadminpassword: string= "";
  newadminusername: string= "";
  newadminrole: string= "admin";
  //test
  userName: string= "blalbalb";

  //delete Admin
  deleteadminadress: string= "";

  constructor(private backendService: BackendService, private authService: AuthenticationService) {}

  showAddAdmin(): void{
    this.addAdmin = true;
  }

  hideAddAdmin(): void{
    this.addAdmin= false;
  }

  showDeleteAdmin(): void{
    this.deleteAdmin = true;
  }

  hideDeleteAdmin(): void{
    this.deleteAdmin= false;
  }

  showChangePassword(): void{
    this.changePassword = true;
  }
  showChangeUsername(): void{
    this.changeUsername = true;
  }

  hideChangePassword():void{
    this.changePassword = false;
  }

  hideChangeUsername(): void{
    this.changeUsername= false;
  }


  hidesureDeleteAdmin(): void{
    this.deleteAdmin= true;
    this.sureDeleteAdmin = false;
  }

  hidesureChangePassword(): void{
    this.changePassword =true;
    this.sureChangePassword =false;
  }

  hidesureChangeUsername(): void{
    this.changeUsername =true;
    this.sureChangeUsername =false;
  }

  DeleteAdmin(): void{
    this.deleteAdmin = false;
    this.sureDeleteAdmin = true
  }

  changemyPassword(): void{
    this.changePassword = false;
    this.sureChangePassword = true;
  }

  changemyUsername(): void{
    this.changeUsername = false;
    this.sureChangeUsername = true;
  }

  sendAddAdminrequest(): void{
    //toDO INFO if add was sucessfull

    let userData = '{"password":"'+this.newadminpassword+'", "email" :"'+this.newadminadress+'", "username" :"'+this.newadminusername+'", "role" :"'+this.newadminrole+'"}';
    const userDataJSON: JSON = JSON.parse(userData);
    console.log("Add Admin"+userDataJSON);


    this.backendService.updatePasswordorUsernameSurveyLeader(userDataJSON).subscribe((response) =>{

        this.authService.updateSessionid(response["Session ID"]);
        console.log("AddAdmin->"+"NEWKEY: "+localStorage.getItem("sessionID"));
      }
    );


    this.addAdmin = false;
  }





  sendDeleteAdminrequest(): void{
    //toDo INFO if change was sucessfull
    let userData = '{"name" :"'+localStorage.getItem("userName")+'"}';

    this.backendService.deleteUser(this.deleteadminadress).subscribe((response) =>{
      this.authService.updateSessionid(response["Session ID"]);
      console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
    })
    this.sureDeleteAdmin = false;
  }




  sendChangePasswordrequest(): void{
    //toDo INFO if change was sucessfull
    let userData = '{"password":"'+this.changedPassword+'", "name" :"'+localStorage.getItem("userName")+'"}';
    console.log("Paswordchange send:"+ userData);
    const passwordandUsername: JSON = JSON.parse(userData);


    this.backendService.updatePasswordorUsernameSurveyLeader(passwordandUsername).subscribe((response) =>{
        this.authService.updateSessionid(response["Session ID"]);
        console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
      }
    );

    this.sureChangePassword = false;
  }

  sendChangeUsernamerequest(): void{
    //toDO INFO if change was sucessfull

    let userData = '{"password":"'+localStorage.getItem("userPassword")+'", "name" :"'+localStorage.getItem("userName")+'"}';
    console.log("Usernamechange send:"+ userData);
    const passwordandUsername: JSON = JSON.parse(userData);

    this.backendService.updatePasswordorUsernameSurveyLeader(passwordandUsername).subscribe((response) =>{
        this.authService.updateSessionid(response["Session ID"]);
        console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
      }
    );



    this.sureChangeUsername = false;
  }


  setUseradressofnewAdmin(event: any): void{
    this.newadminadress = event.target.value;
  }

  setpasswortofnewAdmin(event: any): void{
    this.newadminpassword = event.target.value;
  }

  setUsernameofnewAdmin(event: any): void{
    this.newadminusername = event.target.value;
  }
  setUsernameoftoDeleteAdmin(event: any): void{
    this.deleteadminadress = event.target.value;
  }

  setnewPassword(event: any): void{
    this.changedPassword = event.target.value;
  }

  setnewUsername(event: any): void{
    this.changedUsername = event.target.value;
  }

}
