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

    let userData = '{"password":"'+password+'", "userName" :"'+username+'"}';
    const passwordandUsername: JSON = JSON.parse(userData);

    /*

    let encryptedPasswordandUsernameAsString: string = this.cryptService.encryptMessage(backendPublicKey,PasswordandUsername);
    let encryptedPasswordandUsernameJSON: JSON = JSON.parse('{"Encrypted Username and Password":'+encryptedPasswordandUsernameAsString+'}');

     */

    this.backendS.loadSessionID(passwordandUsername)
      .subscribe((response) =>
        localStorage.setItem( "sessionID", response["Session ID"] )
      );

    console.log(localStorage.getItem("sessionID"));
  }

  updateSessionid(newSessionid: string){
    localStorage.removeItem("sessionID");
    localStorage.setItem("sessionID",newSessionid);
  }




}

