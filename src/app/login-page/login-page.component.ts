import { Component, OnInit } from '@angular/core';
import {UserDto} from '../../Dto/UserDto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../../Services/user.service';
import {User} from '../../Models/User';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  loginUser = new User();
  isLoggedIn = false;
  preloader = false;
  isValid = true;
  constructor(private http: HttpClient, private tokenStorage: UserService) { }

  ngOnInit(): void {
    console.log(this.tokenStorage.getUser());
    if (this.tokenStorage.getUser()) {
      this.isLoggedIn = true;
      window.location.href = '';
    }
  }
  login(): void{
    const body = {
      Name: this.loginUser.name,
      Password: this.loginUser.password};
    const result = this.http.post<any>('https://localhost:44322/api/account/login', body, httpOptions ).subscribe(
      data => {
        this.tokenStorage.saveUser(data);
        if (data != null || data !== undefined)
        {
          this.isLoggedIn = true;
          this.isValid = true;
          window.location.href = '';
        }
      },
      error => {
        console.log(error);
        this.isValid = false;
        this.preloader = false;
      }
    );
    this.preloader = true;

  }

}
