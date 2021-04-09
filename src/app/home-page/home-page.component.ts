import { Component, OnInit } from '@angular/core';
import {UserService} from '../../Services/user.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  isLoggedIn = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.getUser() !== null){
      this.isLoggedIn = true;
    }
  }

}
