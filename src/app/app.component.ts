import {Component, OnInit} from '@angular/core';
import {UserService} from '../Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ReenbitTestClient';
  isLoggedIn = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.getUser() !== null){
      this.isLoggedIn = true;
    }
  }
  logout(): void {
    this.userService.signOut();
    window.location.reload();
  }
}
