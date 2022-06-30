import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/lib/data-access/service/authentication.service';
import { catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthenticationService, private router: Router) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authService.getAuthStatus().pipe(map(
        resonse => {
          console.log("Success");
          localStorage.setItem('sessionID', resonse["Session ID"]);
          return true;
        }),
        catchError(e => {
          console.log("Fail");
          localStorage.clear();
          this.router.navigate(['/login']);
          return of(false);
        })
        )}
  }
