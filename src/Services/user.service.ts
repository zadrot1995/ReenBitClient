import { Injectable } from '@angular/core';
import {UserDto} from '../Dto/UserDto';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }
  UserData = 'userData';
  baseUrl = 'https://localhost:44322/api/user';
  public signOut(): void {
    window.localStorage.clear();
  }

  public saveUser(user: UserDto): void {

    window.localStorage.removeItem(this.UserData);
    window.localStorage.setItem(this.UserData, JSON.stringify(user));
  }

  public getUser(): UserDto{
    return JSON.parse(localStorage.getItem(this.UserData));
  }
  GetAllUsers(){
    return this.http.get<any>(this.baseUrl + '/' + this.getUser().id );
  }
}
