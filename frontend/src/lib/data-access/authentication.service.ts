import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
  }


  getSessionid(benutzername: string, password: string): void {
    //-> call encryption service to generate public key
    //-> call backend with postRequest(public Key of frontend) to get response (public key of Backend)
    //-> store  public Key of Backend in local storage
    //-> here:
    localStorage.setItem("backendpublickey","SERVERRESPONSE");


    //-> call backend with get(encrypted username and userpassword)[queryparameter] to get sessionid
    //-> store sessionid in local storage
    //-> here:
    localStorage.setItem("sessionid","SERVERRESPONSE");
  }



}


