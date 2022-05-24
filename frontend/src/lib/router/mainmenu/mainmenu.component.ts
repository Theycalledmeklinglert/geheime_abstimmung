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
    //INFO if add was sucessfull
    //toDo finish
    let userData = '{"password":"'+this.changedPassword+'", "email" :"'+localStorage.getItem("userEmail")+'", "username" :"'+this.userName+'"}';
    this.addAdmin = false;
  }





  sendDeleteAdminrequest(): void{
    //INFO if change was sucessfull
    //send to backend
    this.sureDeleteAdmin = false;
  }




  sendChangePasswordrequest(): void{
    //INFO if change was sucessfull
    console.log("EMAIL: "+localStorage.getItem("userEmail")+ "NEWPASSWORD:"+ this.changedPassword);
    let userData = '{"password":"'+this.changedPassword+'", "name" :"'+localStorage.getItem("userEmail")+'"}';
    const passwordandUsername: JSON = JSON.parse(userData);

    this.backendService.updatePasswordorUsernameSurveyLeader(passwordandUsername).subscribe((response) =>{

        this.authService.updateSessionid(response["Session ID"]);
        console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
      }
    );




    this.sureChangePassword = false;
  }

  sendChangeUsernamerequest(): void{
    //INFO if change was sucessfull
    //this.backendS.deleteSurveyLeader(this.changedPasswort,localStorage.getItem("sessionid"))
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
