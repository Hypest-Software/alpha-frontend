import { Component } from '@angular/core';
import {environment} from "../environments/environment";

export const BASE_API_URL = environment.apiUrl;
export const API_URL = BASE_API_URL + '/api';
export const CORE_URL = BASE_API_URL + '/core/api';
export const AUTH_URL = BASE_API_URL + '/auth/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'alpha-frontend';
}
