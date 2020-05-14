import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    
    loginForm : FormGroup;
    isLoading = false;
    error : string = null;
  
    constructor( private authenticationService : AuthenticationService , private router :Router) { }
  
    ngOnInit(): void {
      this.loginForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email]), 
         'password': new FormControl(null,Validators.required),
      });
    }
  
    Login(){
      this.isLoading = true;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authenticationService.onLogin(email , password).subscribe(ResponseData =>{
      alert("successfully login");
      this.isLoading = false;
      this.router.navigate(['/home'])
      }, (error) => {
        this.isLoading = false;
        // this.formError = true;
        this.error = error
      }
      );
      this.loginForm.reset();
    }
  
  }
  
