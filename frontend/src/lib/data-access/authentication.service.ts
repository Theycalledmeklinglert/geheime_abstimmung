import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {map} from "rxjs/operators"

export interface LoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) { }

  login(loginForm: LoginForm) {

    return this.httpClient.post<any>('/api/users/login', {email: loginForm.email, password: loginForm.password}).pipe( //temporäre uri
      map((token) => {
        console.log('token');
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    )
  }
}
