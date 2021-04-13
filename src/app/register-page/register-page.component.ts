import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../Models/User';
import {UserService} from '../../Services/user.service';
import {UserDto} from '../../Dto/UserDto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  newUser = new User();
  preloader = false;
  errors: string;
  isValid = true;
  passwordC: string;


  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
  }
  createUser(): void {
    const body = {
      Name: this.newUser.name,
      Password: this.newUser.password
    };
    const result = this.http.post<any>('https://localhost:44322/api/account/register', body, httpOptions)
      .subscribe(data => {
          console.log(result);
          this.isValid = true;
          console.log(body);
          this.userService.saveUser(data);
          window.location.href = '';
        },
        error => {
          console.log(error);
          this.preloader = false;
          this.errors = error.message;
          this.isValid = false;
        }
      );
    this.preloader = true;
    console.log(body);
  }

}
