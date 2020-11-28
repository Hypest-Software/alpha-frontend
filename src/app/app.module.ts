import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { IndexComponent } from './components/index/index.component';
import {OAuthModule} from "angular-oauth2-oidc";
import {AuthService} from "./services/auth.service";
import {AuthModule} from "./services/auth.module";
import {AuthInterceptor} from "./interceptors/auth-http.intercepror";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot({
      resourceServer: {
        sendAccessToken: true,
        allowedUrls: ['http://localhost:8080']
      }
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
