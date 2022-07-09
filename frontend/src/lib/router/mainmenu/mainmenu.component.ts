import {Component, ViewEncapsulation} from "@angular/core";
import {BackendService} from "../../data-access/service/backend.service";
import {AuthenticationService} from "../../data-access/service/authentication.service";
import {Router} from "@angular/router";



@Component({
  selector: 'mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
  encapsulation: ViewEncapsulation.None,
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
  invalidPasswordlengthforCurrentUser: boolean = false;

  //change Username
  changedUsername: string= "";



  //new Admin
  newadminadress: string = "";
  newadminpassword: string= "";
  newadminusername: string= "";
  newadminrole: string= "default";
  invalidPasswordlengthfornewUser: boolean = false;
  invalidemailfornewUser: boolean = false;

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
    this.newadminrole = "default";
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
    if(this.changedPassword != "" && this.invalidPasswordlengthforCurrentUser == false) {
      this.changePassword = false;
      this.sureChangePassword = true;
    }else {}
  }

  changemyUsername(): void{
    this.changeUsername = false;
    this.sureChangeUsername = true;
  }

  sendAddAdminrequest(): void{
    if(this.newadminpassword != ""&& this.newadminadress !=""&&this.newadminusername!="" && this.invalidPasswordlengthfornewUser == false && this.invalidemailfornewUser == false) {

      let userData = '{"password":"' + this.newadminpassword + '", "email" :"' + this.newadminadress.toLowerCase() + '", "name" :"' + this.newadminusername + '", "role" :"' + this.newadminrole + '"}';
      const userDataJSON: JSON = JSON.parse(userData);
      console.log("Add Admin" + userDataJSON);

      this.backendService.addnewSurveLeader(userDataJSON).subscribe({
        next:(response) => {
          console.log("returnt key from Backend: " + response["Session ID"]);
          this.authService.updateSessionid(response["Session ID"]);
          console.log("AddAdmin->" + "NEWKEY: " + localStorage.getItem("sessionID"));

          this.sucesssend = true;
          setTimeout(() => {this.sucesssend = false;}, 1300);
        },
        error: error => {
          error.status == 422 ? console.log("Error 422") : console.log("Not Error 422")
          console.log("Error while Send new SessionID: " + error.error["Session ID"]);

          this.authService.updateSessionid(error.error["Session ID"]);
          this.failsend = true;

          setTimeout(() => {this.failsend = false;}, 1300);
        }
      });
      this.addAdmin = false;
    }
    else {
      alert("Please fill all inputs correct!")
    }
  }





  sendDeleteAdminrequest(): void{

    let userData = '{"name" :"'+localStorage.getItem("userName")+ '", "role" :"'+localStorage.getItem("userRole")+'"}';

    this.backendService.deleteUser(this.deleteadminadress).subscribe({
      next:(response) =>{
        this.authService.updateSessionid(response["Session ID"]);
        console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));

        this.sureDeleteAdmin = false;
        this.sucesssend = true;
        setTimeout(() => { this.sucesssend = false;}, 1300);
      },
      error: error => {
        console.log("Error while Send new SessionID: "+error.error["Session ID"]);

        this.authService.updateSessionid(error.error["Session ID"]);
        this.failsend = true;

        setTimeout(() => { this.failsend = false;}, 1300);
      }
    });
  }



  sendChangePasswordrequest(): void{
    let userData = '{"password":"'+this.changedPassword+'", "name" :"'+localStorage.getItem("userName")+'", "email" :"'+localStorage.getItem("userEmail")+'"}';
    console.log("Paswordchange send:"+ userData);
    const passwordandUsername: JSON = JSON.parse(userData);

    this.backendService.updatePasswordorUsernameSurveyLeader(passwordandUsername).subscribe({
      next:(response) =>{
        this.authService.updateSessionid(response["Session ID"]);
        console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));
        this.sureChangePassword = false;
        this.sucesssend = true;

        setTimeout(() => { this.sucesssend = false;}, 1300);
        },
      error: error => {
        console.log("Error while Send new SessionID: "+error.error["Session ID"]);

        this.authService.updateSessionid(error.error["Session ID"]);
        this.failsend = true;

        setTimeout(() => { this.failsend = false;}, 1300);
      }
    });
  }


  sendChangeUsernamerequest(): void{
    let userData = '{"password":"'+localStorage.getItem("userPassword")+'", "name" :"'+this.changedUsername+'", "email" :"'+localStorage.getItem("userEmail")+'"}';
    console.log("Usernamechange send:"+ userData);
    const passwordandUsername: JSON = JSON.parse(userData);


    this.backendService.updatePasswordorUsernameSurveyLeader(passwordandUsername).subscribe({
      next:(response) =>{
        this.authService.updateSessionid(response["Session ID"]);

        localStorage.setItem("userName", this.changedUsername);
        console.log("Delerequest->"+"NEWKEY: "+localStorage.getItem("sessionID"));

        this.sureChangeUsername = false;
        this.sucesssend = true;

        setTimeout(() => { this.sucesssend = false;}, 1300);
      },
      error: error => {
        console.log("Error while Send new SessionID: "+error.error["Session ID"]);

        this.authService.updateSessionid(error.error["Session ID"]);
        this.failsend = true;

        setTimeout(() => { this.failsend = false;}, 1300);
      }
    });
  }


  setUseradressofnewAdmin(event: any): void{
    this.newadminadress = event.target.value;
    if (!event.target.value.includes("@") ||!event.target.value.includes(".") ){
      console.log("is an Email !!!!")
      this.invalidemailfornewUser = true;
    }else {
      this.invalidemailfornewUser = false;
    }
  }

  setpasswordofnewAdmin(event: any): void{
    this.newadminpassword = event.target.value;
    if(event.target.value.length < 8){
      this.invalidPasswordlengthfornewUser = true;
    }else {this.invalidPasswordlengthfornewUser = false;}
  }

  setUsernameofnewAdmin(event: any): void{
    this.newadminusername = event.target.value;
  }
  setUsernameoftoDeleteAdmin(event: any): void{
    this.deleteadminadress = event.target.value;
  }

  setnewPassword(event: any): void{
    this.changedPassword = event.target.value;
    if(event.target.value.length < 8){
      this.invalidPasswordlengthforCurrentUser = true;
    }else {this.invalidPasswordlengthforCurrentUser = false;}

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
