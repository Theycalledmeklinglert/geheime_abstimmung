import { Component} from "@angular/core";



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
  deleteadminadress: string= "";


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


  sendAddAdminrequest(): void{
    //INFO if add was sucessfull

    this.addAdmin = false;
  }

  showChangePassword(): void{
    this.changePassword = true;
  }

  hideChangePassword():void{
    this.changePassword = false;
  }

  sendDeleteAdminrequest(): void{
    //INFO if add was sucessfull

    this.deleteAdmin = false;
  }

  sendChangePasswordrequest(): void{
    //INFO if change was sucessfull
    this.changePassword = false;
  }


  setUsernameofnewAdmin(event: any): void{
    this.newadminadress = event.target.value;
  }

  setpasswortofnewAdmin(event: any): void{
    this.newadminpassword = event.target.value;
  }

  setUsernameoftoDeleteAdmin(event: any): void{
    this.deleteadminadress = event.target.value;
  }

  setnewPassword(event: any): void{
    this.changedPassword = event.target.value;
  }

}
