import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../Models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

 
  genders = ['Male' , 'Female' , 'Others'];
  CreateNewUserForm: FormGroup;
  isLoading = false;
  error : string = null;
    constructor(private userService : UserService,private router : Router) { }

  ngOnInit(): void {
    this.CreateNewUserForm = new FormGroup({      
       'name': new FormControl(null,[Validators.required ]),
       'email': new FormControl(null, [Validators.required, Validators.email]),
       'disabled': new FormControl('false',Validators.required), 
       'role' : new FormControl('Employee',Validators.required),
       'password': new FormControl(null,Validators.required),
       'date': new FormControl(null,Validators.required),
       'gender': new FormControl('Male',Validators.required),
      //  'disabled':new FormControl('true')
    });
  }

  onCreateNewUser(){
    this.isLoading = true;
    const newUser = new User(
      this.CreateNewUserForm.value.name,
      this.CreateNewUserForm.value.email,
      this.CreateNewUserForm.value.disabled,
      this.CreateNewUserForm.value.role,  
      this.CreateNewUserForm.value.password,
       this.CreateNewUserForm.value.date,
       this.CreateNewUserForm.value.gender,
      //  this.CreateNewUserForm.value.disabled
    )
 
    this.userService.onCreateUser(newUser).subscribe(ResponseData =>{
      // console.log(ResponseData);
      this.isLoading = false;
      this.router.navigate(['/EmployeeList']);
    }, Error => {
      // console.log(Error);
      this.error = "Error Occured";
      this.isLoading = false;
    }
    );
    this.CreateNewUserForm.reset();
  }
  
}
