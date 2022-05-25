import { Injectable } from '@angular/core';
import {EncryptionService} from "./encryption.service";
import {BackendService} from "./backend.service";
import {firstValueFrom, lastValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  loginsucess: boolean;
  constructor(private cryptService: EncryptionService, private backendS: BackendService) {
  }


  async getSessionid(email: string, password: string): Promise<any> {
    //-> call encryption service to generate public key


    /*
    let keyPair = this.cryptService.generateKeyPair();
    let myPublicKey: string = keyPair.publicKey.toString();
    let myPrivateKey: string = keyPair.secretKey.toString();

    //send Frontend publicKey to Backend, and get Backend publicKey
    localStorage.setItem("privateKey", myPrivateKey);
    let myPublicKeyJSON: JSON = JSON.parse('{"Public Key":'+myPublicKey+'}');
    let backendPublicKeyJSON: JSON = this.backendS.postPublicKey(myPublicKeyJSON);

    //safe backend PublicKey as String
    let backendPublicKeyAsString: string = backendPublicKeyJSON["Public Key"]; //toDo check return
    localStorage.setItem("backendKey",backendPublicKeyAsString);

    //format string in Keyformat
    let backendPublicKey: Uint8Array = new TextEncoder().encode(backendPublicKeyAsString);

    // generate and send encrypted Password and Username


    */

    //toDo hash password

    let userData = '{"password":"' + password + '","email" :"' + email + '"}';
    console.log("authservice: " + userData);
    const passwordandUsername: JSON = JSON.parse(userData);

    /*
    let encryptedPasswordandUsernameAsString: string = this.cryptService.encryptMessage(backendPublicKey,PasswordandUsername);
    let encryptedPasswordandUsernameJSON: JSON = JSON.parse('{"Encrypted Username and Password":'+encryptedPasswordandUsernameAsString+'}');

     */
    let response: Promise<Observable<any>> = await lastValueFrom(this.backendS.loadSessionID(passwordandUsername));
    if(response["Session ID"]) {
      localStorage.setItem("sessionID", response["Session ID"]);
      localStorage.setItem("userName",response["userName"]);
      localStorage.setItem("userRole",response["role"]);
      console.log(localStorage.getItem("userRole"));
      console.log("Auth-Service->" + "KEY: " + localStorage.getItem("sessionID"));
      this.loginsucess = true;
    }
    return this.loginsucess;
  }





  updateSessionid(newSessionid: string){
    localStorage.setItem("sessionID",newSessionid);
  }



}

