import { Injectable } from '@angular/core';
import { User } from '../Models/user.model'
import { EmailValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoginResponseData} from '../Models/authentication.model';
import { Authentication } from '../Models/authentication.model'
import { BehaviorSubject, from, Subject } from 'rxjs';
import { tap , take , exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    getDataAvailability = new Subject<boolean>();
    getFilteredTodo = new Subject<User[]>();
  
    isAllowed = false
    users: User[] = [];
    apiUrl="https://employee-manager-app-e42a3.firebaseio.com/";
    apiKey="AIzaSyBYMBNI0O07KEuNpRULJMs09k0fX5gnbP0";
    userAuthentication = new BehaviorSubject<Authentication>(null);
    private tokenExpirationTimer : any;
    usersChangedState = new Subject<any>();
    userDetails : User;
  
    constructor(private http: HttpClient ,private router: Router) { }
    
    setUsers(users: User[]) {
      this.users = users;
      this.usersChangedState.next(this.users.slice());
    }
  
    onCreateUser(newUser : User){
      return this.http
      .post<LoginResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+this.apiKey,
        {
          email : newUser.email,
          password : newUser.password,
          returnSecureToken: true
        }
        )
        .pipe(tap(responseData =>{
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          );
        } ),
          take(1), exhaustMap((responseData) => {
          this.users.push(newUser);
          console.log(this.users);
          return this.http.
          post
          (this.apiUrl + '/users/'+responseData.localId+'.json', newUser);
          // console.log(newUser);
          console.log("the array od users : " +this.users);
        })
        );    
    }
  
    onLogin(email : string, password : string ){
      localStorage.clear();
      this.userDetails = null;
      return this.http.post<LoginResponseData>
      ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+this.apiKey,
        {
          email : email,
          password : password,
          returnSecureToken: true 
        }
        )
        .pipe(tap(responseData =>{
          this.handleAuthentication(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            +responseData.expiresIn
          );
        } ));;    
    }
  
    private handleAuthentication(email: string, userId: string, token: string, expirationIn: number) {
      const expiredDate = new Date(new Date().getTime() + expirationIn * 1000);
      const user = new Authentication(
        email, 
        userId, 
        token, 
        expiredDate
        );
      this.userAuthentication.next(user);
      this.autoLogout(expirationIn * 1000);      
      localStorage.setItem('localId', user.id);
      localStorage.setItem('Data', JSON.stringify(user));
      // console.log(localStorage.getItem('Data'));
    }
  
  
    autoLogin(){
      const userData : {
        email :string,
        id : string,
        _token :string,
        _tokenExpirationDate : string
      } = JSON.parse(localStorage.getItem('Data'));
      if(!userData){
        return;
      }
  
      const loadedUser = new Authentication(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );
  
      if(loadedUser.token){
        this.userAuthentication.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
        this.autoLogout(expirationDuration); 
      }
    }
  
     onLogout(){
      localStorage.removeItem('Data');
      this.router.navigate(['login'])
      this.userAuthentication.next(null);
      if(this.tokenExpirationTimer){
        clearTimeout(this.tokenExpirationTimer);
      } 
      this.tokenExpirationTimer = null; 
    }
  
     autoLogout(expirationDuration : number){
      console.log("Tokken Expires in : " +expirationDuration);
      this.tokenExpirationTimer =  setTimeout(()=>{
         this.onLogout();
       },expirationDuration
       );
     }
     
     getUserDetail() {
      return this.http.get<User[]>(
          this.apiUrl + 'users.json'
        )
        .pipe(
          map(users =>  {
            this.users = [];
            let loginUserData = JSON.parse(localStorage.getItem('Data'));
            for (const key in users) {
              if (users.hasOwnProperty(key)) {
                const user = users[key];
                user.loginStatus = (user.email == loginUserData.email);    
                this.users.push(user);
              }
            }
            return this.users;
          })
        ).subscribe((users) => {
          this.setUsers(users)
        });
    }
  
    // getPerticullarUserDetails(id){
    //   this.http.get(this.apiUrl+"/users/"+id+".json")
    //   .subscribe(
    //     (result:User) => {
    //       this.userDetails = result;
    //     }, 
    //     (err) => {
    //      console.log("error occured");
    //   });
    // }
  
     getCurrentLoggedInUserInfo(){
      return this.users.find(x => x.loginStatus == true);
     }
  
     
    updateUser(updatedInfo) {
      let index = this.users.findIndex((user) => user.loginStatus == true);
      this.users[index].name = updatedInfo.name;
      this.users[index].email = updatedInfo.email;
      this.users[index].status = updatedInfo.status;
      this.users[index].role = updatedInfo.role;
      this.users[index].password = updatedInfo.password;
      this.users[index].date = updatedInfo.date;
      this.users[index].gender = updatedInfo.gender;
  
      return this.http.put(
        this.apiUrl + 'users.json',
        this.users
      );
    }
  
    
    // checkIsAllowed(){
    //   let test =  this.getCurrentLoggedInUserInfo();
    //   if(test.role == 'Admin'){
    //     this.isAllowed = true;
    //   }
    //   else{
    //     this.isAllowed=false;
    //   }
    // }
  
    // getTodos(){
    //   return this.users.slice();
    // }
  
  
    // textSearch(text){
    //   let searchKey = text.toLowerCase();
    //   let userItems:User[] = [];
    //     if(this.users){
    //     for(let user of this.users){
    //       let name:string = user.name;
    //       let email:string = user.email;
    //       console.log(name,email)
    //       if(name.toLowerCase().search(searchKey) > -1 || email.toLowerCase().search(searchKey) > -1)
    //         userItems.push(user);
    //     }
    //     if(userItems.length > 0){
    //       alert('found');
    //     }
    //     else
    //       this.getDataAvailability.next(false);
    //       alert('found');
    //   }    
    // }
  
  
    // deleteUserRecord(id){
    //   console.log("Delete function");
    // }
  
    // ChangeStatus(id){
    //   console.log("Update function");
    // }
  
  
  }
  

