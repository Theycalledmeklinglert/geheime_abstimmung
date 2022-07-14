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

  updateSessionid(newSessionid: string){
    localStorage.setItem('sessionID',newSessionid);
  }


  getAuthStatus():Observable<any> {

    return this.backendS.authSessionId();

  }




}

