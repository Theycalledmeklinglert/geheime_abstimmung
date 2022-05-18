import { Injectable } from '@angular/core';
import {EncryptionService} from "./encryption.service";
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(private cryptService: EncryptionService, private backendS: BackendService) {
  }


  getSessionid(username: string, password: string): void {
    //-> call encryption service to generate public key
    let myPublicKey: string = this.cryptService.generateKeys().toString();
    //-> call backend with postRequest(public Key of frontend) to get response (public key of Backend)
    let backendPublicKey: string = "test"; // (casttostring) this.backendS.setFrontendPublicKey(myPublicKey);
    //-> store  public Key of Backend in local storage
    //-> here:
    localStorage.setItem("backendpublickey",backendPublicKey);


    //let user: string = this.cryptService.encryptMessage(backendPublicKey,jsonofusernameandpasssord,);

    //-> call backend with get(encrypted username and userpassword)[queryparameter] to get sessionid
    //this.backendS.getSessionKey
    //-> store sessionid in local storage
    //-> here:
    localStorage.setItem("sessionid","SERVERRESPONSE");
  }



}


