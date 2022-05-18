import { Component} from "@angular/core";
import {LoginComponent} from "../login/login.component";
import {BackendService} from "../../data-access/backend.service";



@Component({
  selector: 'mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css'],
})

export class MainmenuComponent{

  isAdmin: boolean = true;
  addAdmin: boolean;
  deleteAdmin:boolean;
  changePassword: boolean;
  changedPassword: string= "";
  newadminadress: string = "";
  newadminpassword: string= "";
  newadminusername: string= "";
  deleteadminadress: string= "";
  backendS: BackendService = new BackendService();


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

  hideChangePassword():void{
    this.changePassword = false;
  }

  sendAddAdminrequest(): void{
    //INFO if add was sucessfull
   // this.backendS.setSurveyLeader()
    this.addAdmin = false;
  }


  sendDeleteAdminrequest(): void{
    //INFO if delete was sucessfull
    //this.backendS.deleteSurveyLeader(this.deleteadminadress,localStorage.getItem("sessionid"))
    this.deleteAdmin = false;
  }

  sendChangePasswordrequest(): void{
    //INFO if change was sucessfull
    //this.backendS.deleteSurveyLeader(this.changedPasswort,localStorage.getItem("sessionid"))
    this.changePassword = false;
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

}
