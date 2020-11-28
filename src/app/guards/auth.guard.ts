import {throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {JwtHelperService} from '@auth0/angular-jwt';
import {of} from 'rxjs/internal/observable/of';
import {AuthState} from "../services/auth.state";
import {AuthService} from "../services/auth.service";
import {Profile} from "../services/profile.model";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authState: AuthState,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const helper = new JwtHelperService();

    if (!this.authState.isAuthenticated()) {
      if (this.authState.accessToken) {
        return this.initSession(route).then(() => {
          return true;
        });
      } else {
        this.redirectToLoginPage(true);
        return of(false).toPromise();
      }
    } else if (this.authState.accessToken && helper.isTokenExpired(this.authState.accessToken)) {
      return this.authService
        .refreshToken()
        .then(() => {
          return this.initSession(route).then(() => {
            return true;
          });
        })
        .catch(() => {
          this.redirectToLoginPage();
          return of(false).toPromise();
        });
    } else {
      return of(!!this.authState.isAuthenticated()).toPromise();
    }
  }

  private redirectToLoginPage(saveLastPage = false) {
    if (saveLastPage) {
      this.authState.lastVisitedPage = location.href;
    }
    this.router.navigate(['login']);
  }

  private initSession(route: ActivatedRouteSnapshot): Promise<boolean> {
    return this.authService
      .getProfile()
      .then((profile: Profile) => {
        if (!profile) {
          this.redirectToLoginPage();
          return false;
        } else if (this.authState.isAuthenticated()) {
          const redirectRoute = route.url.join('/') ? route.url.join('/') : '';
          this.router.navigate(['/app/' + redirectRoute]);
          return true;
        }
        return false;
      })
      .catch(err => {
        if (err.httpError.status === 401) {
          this.redirectToLoginPage();
          return of(false).toPromise();
        } else {
          return throwError(err).toPromise();
        }
      });
  }
}
