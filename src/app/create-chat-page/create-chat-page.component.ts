import { Component, OnInit } from '@angular/core';
import {ChatCreateDto} from '../../Dto/ChatCreateDto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../../Services/user.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-create-chat-page',
  templateUrl: './create-chat-page.component.html',
  styleUrls: ['./create-chat-page.component.css']
})
export class CreateChatPageComponent implements OnInit {

  constructor(private http: HttpClient, private userService: UserService) { }
  chatCreateDto = new ChatCreateDto();
  text: string;

  ngOnInit(): void {
  }
  createChat(): void {
    this.chatCreateDto.usersId = [];
    this.chatCreateDto.usersId.push(this.text);
    this.chatCreateDto.usersId.push(this.userService.getUser().id);

    const body = {
        Name: this.chatCreateDto.name,
        UsersId: this.chatCreateDto.usersId
      };
    const result = this.http.post('https://localhost:44322/api/chat', body, httpOptions)
        .subscribe(data => {
            console.log(result);
            console.log(body);
            window.location.href = '';
          },
          error => {
            console.log(error);
          }
        );
    console.log(body);
    }

}
