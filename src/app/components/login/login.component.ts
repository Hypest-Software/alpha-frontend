import {Component, Inject, OnInit} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";
import {AuthService} from "../../services/auth.service";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) {


  }

  ngOnInit(): void {
    this.authService.login('user', 'pass')
      .then(user => {
        // if (user) {
        //   if (
        //     this.authState.lastVisitedPage &&
        //     !this.authState.lastVisitedPage.includes('invitation') &&
        //     !this.authState.lastVisitedPage.includes('404')) {
        //     this.router.navigateByUrl(this.authState.lastVisitedPage);
        //   } else {
        //     this.router.navigate(['app']);
        //   }
        // } else {
        //   this.toastService.error('Something went wrong, please try again.', 'Error');
        // }
        console.log(user)
      });
  }

}
