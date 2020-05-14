import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthenticationGuard } from './Guards/authentication.guard';
import { ProfileComponent } from './profile/profile.component';
import { AddUserComponent } from './home/add-user/add-user.component';
import { ListUserComponent } from './home/list-user/list-user.component';


const routes: Routes = [

  {path : 'login' , component : LoginComponent},
  {path : 'home' , component : HomeComponent,canActivate : [AuthenticationGuard],  
    children :  [
      { path : 'addUser' ,component : AddUserComponent},
      { path : 'listUser' ,component : ListUserComponent},
    ] 
  },
  {path : 'header' , component : HeaderComponent ,canActivate : [AuthenticationGuard]},
  {path : 'profile' , component : ProfileComponent ,canActivate : [AuthenticationGuard]},
  {path : 'page-not-found' , component : PageNotFoundComponent},
  {  path:"**" , component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
