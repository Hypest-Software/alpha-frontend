import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {IndexComponent} from "./components/index/index.component";

const routes: Routes = [
  {path: '', component: IndexComponent, redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
