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


  sendDeleteAdminrequest(): void{
    //INFO if add was sucessfull

    this.deleteAdmin = false;
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

}
