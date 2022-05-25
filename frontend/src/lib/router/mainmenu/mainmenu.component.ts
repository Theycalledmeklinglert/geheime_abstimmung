import { Component} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {Router} from "@angular/router";



@Component({
  selector: 'mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
})

export class MainmenuComponent{

  //SysAdmin?
  isSysAdmin: boolean = false;

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
  newadminrole: string= "default";
  //test
  username: string= "defaultname";

  //delete Admin
  deleteadminadress: string= "";

  //symbolls
  sucesssend: boolean = false;
  failsend: boolean = false;

  constructor(private backendService: BackendService, private authService: AuthenticationService, private router: Router) {
    if(localStorage.getItem("userRole")=="admin"){
      this.isSysAdmin = true;
    }
  }

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
    let userData = '{"password":"'+this.newadminpassword+'", "email" :"'+this.newadminadress+'", "name" :"'+this.newadminusername+'", "role" :"'+this.newadminrole+'"}';
    const userDataJSON: JSON = JSON.parse(userData);
    console.log("Add Admin"+userDataJSON);

    try {
      this.backendService.addnewSurveLeader(userDataJSON).subscribe((response) =>{
          console.log("returnt key from Backend: "+ response["Session ID"] );
          this.authService.updateSessionid(response["Session ID"]);
          console.log("AddAdmin->"+"NEWKEY: "+localStorage.getItem("sessionID"));
          this.sucesssend = true;
          setTimeout(() => { this.sucesssend = false;}, 1300);
      });


    }catch (err){

    }



    this.addAdmin = false;
  }





  sendDeleteAdminrequest(): void{
    //toDo INFO if change was sucessfull
    let userData = '{"name" :"'+localStorage.getItem("userName")+ '", "role" :"'+localStorage.getItem("userRole")+'"}';

    try {
      this.backendService.deleteUser(this.deleteadminadress).subscribe((response) =>{
        this.authService.updateSessionid(response["Session ID"]);
        console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
        this.sureDeleteAdmin = false;
        this.sucesssend = true;
        setTimeout(() => { this.sucesssend = false;}, 1300);
      });



    }catch (err){
      this.failsend = true;
    }
  }



  sendChangePasswordrequest(): void{
    //toDo INFO if change was sucessfull
    let userData = '{"password":"'+this.changedPassword+'", "name" :"'+localStorage.getItem("userName")+'", "email" :"'+localStorage.getItem("userEmail")+'"}';
    console.log("Paswordchange send:"+ userData);
    const passwordandUsername: JSON = JSON.parse(userData);

    try {
      this.backendService.updatePasswordorUsernameSurveyLeader(passwordandUsername).subscribe((response) =>{
          this.authService.updateSessionid(response["Session ID"]);
          console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
          this.sureChangePassword = false;
        this.sucesssend = true;
        setTimeout(() => { this.sucesssend = false;}, 1300);
        });


    }catch (err){

    }



  }

  sendChangeUsernamerequest(): void{
    //toDO INFO if change was sucessfull

    let userData = '{"password":"'+localStorage.getItem("userPassword")+'", "name" :"'+this.changedUsername+'", "email" :"'+localStorage.getItem("userEmail")+'"}';
    console.log("Usernamechange send:"+ userData);
    const passwordandUsername: JSON = JSON.parse(userData);

    try {
      this.backendService.updatePasswordorUsernameSurveyLeader(passwordandUsername).subscribe((response) =>{
          this.authService.updateSessionid(response["Session ID"]);
          localStorage.setItem("userName", this.changedUsername);
          console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
          this.sureChangeUsername = false;
        this.sucesssend = true;
        setTimeout(() => { this.sucesssend = false;}, 1300);
      });

    }catch (err){}



  }


  setUseradressofnewAdmin(event: any): void{
    this.newadminadress = event.target.value;
  }

  setpasswordofnewAdmin(event: any): void{
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

  setadmin():void{
    if(this.newadminrole == "default"){
      this.newadminrole = "admin";
      console.log("set admin");
    }else {
      this.newadminrole = "default";
      console.log("set normal")
    }
  }






  logout():void{
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
