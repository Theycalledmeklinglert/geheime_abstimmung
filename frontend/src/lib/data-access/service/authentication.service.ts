import { Injectable } from '@angular/core';
import { EncryptionService } from "./encryption.service";
import { BackendService } from "./backend.service";
import { Observable } from "rxjs";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  loginsucess: boolean;
  constructor(private cryptService: EncryptionService, private backendS: BackendService, private router: Router) {
  }


  getAuthUser(email: string, password: string): Observable<any> {
    let userData = '{"password":"' + password + '","email" :"' + email + '"}';
    const passwordandUsername: JSON = JSON.parse(userData);

    return this.backendS.loadSessionID(passwordandUsername);
  }



  easyKeyexchange():void{

    let keyPair = this.cryptService.generateKeyPair();
    let myPublicKey: string = keyPair.publicKey;
    let myPrivateKey: string = keyPair.privateKey;

    //send Frontend publicKey to Backend, and get Backend publicKey
    localStorage.setItem("myPrivateKey", myPrivateKey);
    /*
    let myPublicKeyJSON: JSON = JSON.parse('{"email":"' + email + '","Public Key" :"' + myPublicKey + '"}');
    let backendPublicKeyJSONresponse: Promise<Observable<any>> = await lastValueFrom(this.backendS.keyExchange(myPublicKeyJSON));

    if(backendPublicKeyJSONresponse["Public Key"]) {
      localStorage.setItem("backendPublicKey",backendPublicKeyJSONresponse["Public Key"]);
      console.log("Public Key of Backend: " + localStorage.getItem("backendPublicKey"));
    }

     */
  }




  updateSessionid(newSessionid: string){
    localStorage.setItem('sessionID',newSessionid);
  }


  getAuthStatus():Observable<any> {

    return this.backendS.authSessionId();

  }




}

