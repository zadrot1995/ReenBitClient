import { Component, OnInit } from '@angular/core';
import {ChatCreateDto} from '../../Dto/ChatCreateDto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../../Services/user.service';
import {MatSelectModule} from '@angular/material/select';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {UserDto} from '../../Dto/UserDto';
import {ChatDto} from '../../Dto/ChatDto';
import {log} from 'util';


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
  isPrivate = false;
  text: string;
  types = ['Private', 'Group'];
  preloader = false;
  users: UserDto[];
  selectedUsers: UserDto[];
  findByName = '';
  public userListBlock = this.chatCreateDto.chatType === this.types[0] && this.chatCreateDto?.usersId.length >= 1;

  ngOnInit(): void {
    this.GetUsers();
    this.users = [];
    this.selectedUsers = [];
    this.chatCreateDto.usersId = [];
    this.chatCreateDto.name = '';


  }
  createChat(): void {
    if (this.chatCreateDto.chatType === 'Private'){
    }
    this.chatCreateDto.usersId.push(this.userService.getUser().id);

    const body = {
        name: this.chatCreateDto.name,
        usersId: this.chatCreateDto.usersId,
        chatType: this.chatCreateDto.chatType,
        adminId: this.userService.getUser().id
      };
    const result = this.http.post<ChatDto>('https://localhost:44322/api/chat', body, httpOptions)
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

    selectUser(userDto: UserDto): void {
    console.log(this.userListBlock);
    if (!(this.chatCreateDto.chatType === this.types[0] && this.chatCreateDto?.usersId.length >= 1)) {
      this.selectedUsers.push(userDto);
      this.chatCreateDto.usersId.push(userDto.id);
      for (let i = 0; i < this.users.length; i++) {

        if ((this.users)[i] === userDto) {
          this.users.splice(i, 1);
          i--;
        }
      }
    }
    }
    deleteSelectedUser(userDto: UserDto): void {
      this.users.push(userDto);
      for ( let i = 0; i < this.selectedUsers.length; i++){

        if ( (this.selectedUsers)[i] === userDto) {
          this.selectedUsers.splice(i, 1);
          i--;
      }
    }
      for ( let i = 0; i < this.chatCreateDto.usersId.length; i++){

        if ( (this.chatCreateDto.usersId)[i] === userDto.id) {
          this.chatCreateDto.usersId.splice(i, 1);
          i--;
        }
      }
      this.setPrivatBlock();
  }

  GetUsers(){
    this.preloader = true;
    this.userService.GetAllUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
      this.preloader = false;
    });
  }
  filterUser(){
    if (this.findByName !== '')
    {
      for ( let i = 0; i < this.users.length; i++){

        if ( !(this.users)[i].name.includes(this.findByName)) {
          this.users.splice(i, 1);
          i--;
        }
      }
    }
    else {
      this.GetUsers();
    }
  }
  setPrivatBlock(): boolean{
    return this.chatCreateDto.chatType === this.types[0] && this.chatCreateDto?.usersId.length >= 1;
  }
  setPrivateValidation(): void{
    for ( let i = 0; i < this.selectedUsers.length; i++){
      if (this.chatCreateDto.chatType === this.types[0] && this.chatCreateDto?.usersId.length > 1){
        this.users.push( this.selectedUsers.pop());
      }
      else {
        break;
      }
      }
  }

}



