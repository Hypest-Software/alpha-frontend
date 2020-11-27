import {ModuleWithProviders, NgModule} from '@angular/core';

import {AuthService} from './auth.service';
import {AuthState} from './auth.state';


@NgModule({})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        AuthState,

      ]
    };
  }
}
