import {Component, OnInit} from '@angular/core';
import {Profile} from "../../services/profile.model";
import {AuthState} from "../../services/auth.state";
import {cloneDeep} from 'lodash';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  currentUser: Profile;

  constructor(
    private authState: AuthState,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.currentUser = cloneDeep(this.authState.user);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => {
      location.reload();
    });
  }
}
