import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
// import {Profile} from './profile.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {cloneDeep} from 'lodash';
import {Profile} from "./profile.model";
// import {BillingSubscription} from '../models/billing-subscription.model';

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
}

@Injectable()
export class AuthState {
  $token: Observable<string>;

  currentProfile$: Observable<Profile>;
  currentProfile: Profile;
  private profileSubject: Subject<Profile>;

  // currentSub$: Observable<BillingSubscription>;
  // currentSub: BillingSubscription;
  // private currentSubSubject: Subject<BillingSubscription>;

  envStatus$: Observable<boolean>;
  envStatus: boolean;
  private envStatusSubject: Subject<boolean>;

  private currentToken: string;
  private currentRefreshToken: string;

  private tokenSubject: Subject<string>;

  private jwtHelper = new JwtHelperService();

  private lastVisitedPageUrl: string;

  get user(): Profile {
    return this.currentProfile;
  }

  get user$(): Observable<Profile> {
    return this.currentProfile$;
  }

  // get subscription(): BillingSubscription {
  //   return this.currentSub;
  // }

  get environment(): boolean {
    return this.envStatus;
  }

  get accessToken(): string {
    return this.getToken();
  }

  get refreshToken(): string {
    return this.getRefreshToken();
  }

  set lastVisitedPage(value: string) {
    if (value.indexOf('http') !== -1) {
      this.lastVisitedPageUrl = cloneDeep(value
        .split('/')
        .splice(3)
        .join('/'));
    } else {
      this.lastVisitedPageUrl = cloneDeep(value);
    }

    this.lastVisitedPageUrl = this.lastVisitedPageUrl ? this.lastVisitedPageUrl : '/app';
  }

  get lastVisitedPage() {
    return this.lastVisitedPageUrl;
  }

  constructor() {
    this.tokenSubject = new Subject<string>();
    this.$token = this.tokenSubject.asObservable();

    if (this.accessToken) {
      this.currentToken = this.accessToken;
      this.currentRefreshToken = this.refreshToken;
    }

    this.profileSubject = new Subject<Profile>();
    this.currentProfile$ = this.profileSubject.asObservable();

    this.currentProfile$.subscribe(profile => {
      this.currentProfile = cloneDeep(profile);
    });

    // this.currentSubSubject = new Subject<BillingSubscription>();
    // this.currentSub$ = this.currentSubSubject.asObservable();
    //
    // this.currentSub$.subscribe(subscription => {
    //   this.currentSub = cloneDeep(subscription);
    // });

    this.envStatusSubject = new Subject<boolean>();
    this.envStatus$ = this.envStatusSubject.asObservable();

    this.envStatus$.subscribe(subscription => {
      this.envStatus = cloneDeep(subscription);
    });
  }

  isAuthenticated() {
    return !!this.currentToken && !this.jwtHelper.isTokenExpired(this.currentToken) && !!this.currentProfile;
  }

  isTokenExpired() {
    return this.jwtHelper.isTokenExpired(this.currentToken);
  }

  setProfile(profile: Profile) {
    this.profileSubject.next(profile);
  }

  // setSubscription(subscription: BillingSubscription) {
  //   this.currentSubSubject.next(subscription);
  // }

  setEnvStatus(envStatus) {
    this.envStatusSubject.next(envStatus);
  }

  setToken(token) {
    this.currentToken = cloneDeep(token);
    this.tokenSubject.next(this.currentToken);
    localStorage.setItem('AUTH_TOKEN', JSON.stringify(this.currentToken));
  }

  clearToken() {
    localStorage.setItem('AUTH_TOKEN', null);
  }

  setRefreshToken(token) {
    this.currentRefreshToken = cloneDeep(token);
    localStorage.setItem('AUTH_REFRESH_TOKEN', JSON.stringify(this.currentRefreshToken));
  }

  clearRefreshToken() {
    localStorage.setItem('AUTH_REFRESH_TOKEN', null);
  }

  private getToken(): string {
    return JSON.parse(localStorage.getItem('AUTH_TOKEN'));
  }

  private getRefreshToken(): string {
    return JSON.parse(localStorage.getItem('AUTH_REFRESH_TOKEN'));
  }
}
