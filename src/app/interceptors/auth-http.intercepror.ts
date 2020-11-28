import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthState} from "../services/auth.state";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authState: AuthState) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers || new HttpHeaders();
    if (!headers.get('Content-type')) {
      headers = headers.set('Content-Type', 'application/json');
    }

    if (req.url.indexOf('/api/') === -1) {
      return next.handle(req.clone({headers}));
    }

    if (req.url === '/api/token/refresh' && this.authState.refreshToken) {
      headers = headers.set('Authorization', 'Bearer ' + this.authState.refreshToken);
      return next.handle(req.clone({headers}));
    }

    if (this.authState.accessToken) {
      headers = headers.set('Authorization', 'Bearer ' + this.authState.accessToken);
      return next.handle(req.clone({headers}));
    }

    return next.handle(req.clone({headers}));
  }
}
