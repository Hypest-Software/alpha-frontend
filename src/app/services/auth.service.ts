import {Injectable} from '@angular/core';
// import {Profile} from './profile.model';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
// import {AuthState, AuthToken} from './auth.state';
import {JwtHelperService} from '@auth0/angular-jwt';
import * as moment from 'moment';
import {of} from 'rxjs/internal/observable/of';
import {map} from 'rxjs/operators';
import {AUTH_URL, API_URL} from "../app.component";
import {AuthState, AuthToken} from "./auth.state";
import {Profile} from "./profile.model";
import {ProfileData} from "./profile.data";
// import {ProfileData} from './profile.data';
// import {SubscriptionService} from '../modules/settings/modules/billing/subscription.service';
// import {TenantService} from '../services/tenant.service';

export interface RegisterData {
  userEmail: string;
  userPassword: string;
  companyName: string;
  userFirstName: string;
  userLastName: string;
}

@Injectable()
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private timeoutHandler;

  // private authUrl = environment.authPath;

  private authUrl = AUTH_URL;

  constructor(private httpClient: HttpClient, private authState: AuthState/*, private subscriptionService: SubscriptionService, private tenantService: TenantService*/) {
    if (!this.timeoutHandler) {
      this.initAutoRefreshToken();
    }
  }

  register(registerData: RegisterData): Promise<{ uuid: string }> {

    return this.httpClient
      .post(
        API_URL + '/auth/v1/tenants',
        registerData
      )
      .toPromise()
      .then((ret: { uuid: string }) => {
        if (ret && ret.uuid) {
          return of(ret).toPromise();
        }
        return of(null).toPromise();
      });
  }

  async login(username: string, pass: string): Promise<Profile> {
    // + '/v1/login
    const body = new HttpParams()
      .set('username', username)
      .set('password', pass)
      .set('grant_type', 'password')
    return await this.httpClient.post('http://localhost:8080/oauth/token', body.toString(),
      {
        headers: {
          'Authorization': 'Basic d2ViYXBwOnBhc3N3b3Jk',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .pipe(
        map((res: AuthToken) => {
          if (res && res.access_token) {
            this.authState.setToken(res.access_token);
            this.authState.setRefreshToken(res.refresh_token);
            this.initAutoRefreshToken();

            return this.getProfile();
          }
          return of(null).toPromise();
        })
      ).toPromise();
  }

  logout(): void {
    // TO THINK
    this.authState.clearToken();
    this.authState.clearRefreshToken();
    if (this.timeoutHandler) {
      clearTimeout(this.timeoutHandler);
    }
  }

  async getProfile(): Promise<Profile> {
    // const subscription = await this.subscriptionService.initSubscriptionStatus();
    const envStatus = await this.getEnvStatus();

    // this.authState.setSubscription(subscription);
    this.authState.setEnvStatus(envStatus);

    return this.httpClient
      .get('http://localhost:8080/api/v1/users/me')
      .pipe(
        map((data: ProfileData) => {
          if (data) {
            const currentProfile = new Profile(data);
            this.authState.setProfile(currentProfile);
            return currentProfile;
          }
          return null;
        })
      )
      .toPromise();
  }

  private async getEnvStatus(): Promise<boolean> {
    // return this.tenantService.getEnvStatus()
    //   .then(res => {
    //     return res;
    //   })
    //   .catch(() => {
    //     return false;
    //   });
    return  null;
  }

  async refreshToken(): Promise<boolean> {
    console.warn('==refreshToken==');

    return this.httpClient.post(this.authUrl + '/v1/refresh', {refresh_token: this.authState.refreshToken},
      {
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'}
      })
      .pipe(
        map((res: AuthToken) => {
          if (res && res.access_token) {
            this.authState.setToken(res.access_token);
            this.authState.setRefreshToken(res.refresh_token);
          }
          return of(true).toPromise();
        })
      ).toPromise();
  }

  private initAutoRefreshToken() {
    if (this.authState.accessToken) {
      const expDate = this.jwtHelper.getTokenExpirationDate(this.authState.accessToken);
      if (expDate) {
        const timeout = moment(expDate).diff(moment()) - 5000;

        if (timeout) {
          console.warn('--refresh token in [s]', timeout / 1000);
          if (this.timeoutHandler || timeout <= 0) {
            clearTimeout(this.timeoutHandler);
          }
          this.timeoutHandler = setTimeout(() => {
            this.refreshToken().then(() => {
              console.warn('--token refreshed--');
              this.initAutoRefreshToken();
            }).catch((err: HttpErrorResponse) => {
              console.log(err);
              if (err.error.error === 'invalid_token') {
                clearTimeout(this.timeoutHandler);
                this.logout();
              }
            });
          }, timeout);
        }
      }
    }
  }
}
