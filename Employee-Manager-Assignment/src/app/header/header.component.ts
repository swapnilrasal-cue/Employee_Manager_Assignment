import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userStatus = false;
  isAuthenticated = false;
  isAllowed = false;
  private userSubscription : Subscription;
  constructor(private authenticationService: AuthenticationService) { }
  

  ngOnInit(): void {
    
    this.userSubscription = this.authenticationService.userAuthentication
    .subscribe(userAuthentication => {
      this.isAuthenticated = false;
      if(userAuthentication){
        this.isAuthenticated = true;
        let userStatus = JSON.parse(localStorage.getItem('Data'));
      }
      console.log(userAuthentication);
    })
  }
  
  onLogoutUser(){
    this.authenticationService.onLogout();
  }
  ngOnDestroy(){
    this.userSubscription.unsubscribe();
  }
}
