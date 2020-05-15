import { Component, OnInit } from '@angular/core';
import { FormGroup , FormControl, Validators} from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { User } from '../../Models/user.model';
import { Router } from '@angular/router';
// import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  
  
      users: User[] = [];
      EditUserForm : FormGroup;
      updateUser;
      genders = ['Male' , 'Female' , 'Others'];
      
      userDetails:User;
      isLoading = false;
    
      constructor(private userService : UserService,
                  private router: Router) { }
    
      ngOnInit(): void {
        this.userService.getDetail();
        // this.userService.getUserDetail();
        // this.userService.usersChanged.subscribe((users) => {
        // this.isLoading = false;
        // this.users = users;
        // });
    
        this.updateUser = this.userService.getUpdateRecord();
        // const userData = JSON.stringify(this.updateUser);
        // console.log("updated user"+userData);
        
  
        // const loggedInUser = this.userService.getCurrentLoggedInUserInfo();
        // console.log("loggedInUser "+loggedInUser);
    
        // if (!loggedInUser) {
        //   this.router.navigate(['/login']);
        // }
        
        let newname = this.updateUser.name;
        let newemail = this.updateUser.email;
        let newdisabled = this.updateUser.disabled;
        let newrole = this.updateUser.role;
        let newpassword = this.updateUser.password;
        let newdate = this.updateUser.date;
        let newgender = this.updateUser.gender;
        
        this.EditUserForm  = new FormGroup({
          'name': new FormControl(newname,[Validators.required ]),
          'email': new FormControl(newemail, [Validators.required, Validators.email]),
          'disabled': new FormControl(newdisabled,Validators.required), 
          'role' : new FormControl(newrole,Validators.required),
          'password': new FormControl(newpassword,Validators.required),
          'date': new FormControl(newdate,Validators.required),
          'gender': new FormControl(newgender,Validators.required),
       });
      }
    
      onEditUser() {
          this.isLoading = true;
          this.userService.updateUser(this.EditUserForm.value)
           .subscribe((users) => {
            this.userService.usersChanged.next(users);
            this.isLoading = false;
            this.router.navigate(['/home/listUser']);
    
          });
        }
      
  }

