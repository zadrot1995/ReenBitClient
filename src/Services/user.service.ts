import { Injectable } from '@angular/core';
import {UserDto} from '../Dto/UserDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  UserData = 'userData';
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
}
