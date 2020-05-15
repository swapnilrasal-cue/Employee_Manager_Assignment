import { Component, OnInit, Output, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { User } from '../../Models/user.model';
import { EventEmitter } from 'protractor';
import { UserService } from '../../Services/user.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
// import { FilterService } from '../../Services/filter.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {

  @Input() searchModel;
  // updateUserRecords = [];

  SeachModelChange = new BehaviorSubject<User>(null);

   users : User[] = [];
   filterStatus: string = '';
   filterRole: string = '';
   userDetails : User;

  //  @Output() passTodoId = new EventEmitter<string>();


   postsArray  = [];
  constructor(private http : HttpClient,private userService : UserService,
              private router : Router) { }
  
  ngOnInit(): void {
    this.fetchUsers();
  }

  ngDoCheck() {
    this.userService.usersChanged.subscribe((users: User[]) => {
      this.users = users;
    });
  }

  private fetchUsers() {
    this.http
      .get('https://employee-manager-app-e42a3.firebaseio.com/users.json')
      .pipe(
        map(responseData => {
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              this.users.push({ ...responseData[key], id: key });
            }
          }
          return this.users;
        })
      )
      .subscribe(posts => {
        console.log(posts);
      });
  }
  
  showAllTodos(){
    // document.getElementById('filterByStatus').style.display = "none";
    // document.getElementById('filterByRole').style.display = "none"; 
    // document.getElementById('filterByDate').style.display = "none";
    // document.getElementById('filterByStatus').nodeValue = null;
    // document.getElementById('filterByRole').style.display = "none"; 
    // document.getElementById('filterByDate').style.display = "none";
    // this.router.navigate(['/EmployeeList']);
  }

  showFurtherFilters() {
    let filterType: any = document.getElementById('filterBy');
    let filterName: any = filterType.options[filterType.selectedIndex].value;

    if (filterName == "Status") {
      this.setFilterValues("none", "inline-block", "none");
    }
  
    else if (filterName == "Role") {
      this.setFilterValues("inline-block", "none", "none");
    }
    // else if (filterName == "Date") {
    //   this.setFilterValues("none", "none", "inline-block");
    // }
    else if (filterName == "Select") {
      this.setFilterValues("none", "none", "none");
    }
  }

  setFilterValues(role, status,select) {
    document.getElementById('filterByRole').style.display = role;
    document.getElementById('filterByStatus').style.display = status;
    // document.getElementById('filterByDate').style.display = date;
    document.getElementById('removeFilter').style.display = select;
  }

  textSearch(searchKey){
    this.userService.textSearch(searchKey.value);
  }
   
  deleteRecord(id){
    console.log(id);
   this.userService.deleteUserRecord(id).subscribe(data =>{
     console.log("deleted Successfully");
     this.router.navigate(['/home']);
   })
  }

  updateRecord(id){
    console.log(id);
    this.userService.updateRecord(id).subscribe(
     Response=> {
      console.log(Response);
      this.router.navigate(['/home/editUser']);
     });
  }

  // updateRecord(id){
  //   console.log(id);
  //  this.userService.updateUserRecord(id);
  // }

  onChangeStatus(id){
  this.userService.ChangeStatus(id);
  }



}


