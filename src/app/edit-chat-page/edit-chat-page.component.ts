import {AfterContentInit, Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../../Services/user.service';
import {ChatCreateDto} from '../../Dto/ChatCreateDto';
import {UserDto} from '../../Dto/UserDto';
import {ChatDto} from '../../Dto/ChatDto';
import {ActivatedRoute, Router} from '@angular/router';
import {ChatService} from '../../Services/chat.service';
import {SignalrService} from '../../Services/signalr.service';
import {ChatEditDto} from '../../Dto/ChatEditDto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Component({
  selector: 'app-edit-chat-page',
  templateUrl: './edit-chat-page.component.html',
  styleUrls: ['./edit-chat-page.component.css']
})
export class EditChatPageComponent implements OnInit, AfterContentInit {

  constructor(private http: HttpClient,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private chatService: ChatService,
              private signalrService: SignalrService) { }

  chatDto = new ChatEditDto();
  isPrivate = false;
  text: string;
  types = ['Private', 'Group'];
  preloader = false;
  users: UserDto[] = [];
  selectedUsers: UserDto[] = [];
  findByName = '';

  ngOnInit(): void {
    this.chatDto.id = this.route.snapshot.paramMap.get('id');
    this.users = [];
    this.getSelectedUsers();
    this.GetUsers();
    this.diference();
  }

  createChat(): void {
    this.signalrService.SendEditChatToHub(this.chatDto);
  }

  selectUser(userDto: UserDto): void {
  }
  deleteSelectedUser(userDto: UserDto): void {
  }

  GetUsers(){
    this.preloader = true;
    this.userService.GetAllUsers().subscribe(data => {
      this.users = data;
      console.log(this.users);
      this.preloader = false;
      const missing = this.users.filter(item => this.selectedUsers.indexOf(item) < 0);
      this.diference();
      console.log('Missing', missing);
    });
  }
  diference(): void{
    for (let i = 0; i < this.users.length; i++){
      for (let j = 0; j < this.selectedUsers.length; j++)
      {
        if ( !(this.users)[i].name.includes(this.selectedUsers[j].name)) {
          this.users.splice(i, 1);
          i--;
        }
      }
    }
    console.log('Users: ', this.users);
  }
  getSelectedUsers(): void{
    this.chatService.getChat(this.chatDto.id).subscribe(data => {
      for (let i = 0; i < data.users.length; i++) {
        const user = new UserDto();
        user.id = data.users[i].id;
        user.name = data.users[i].userName;
        console.log(user);
        this.selectedUsers.push(user);
      }
      this.chatDto.name = data.name;
      console.log('Data: ', data);
      this.preloader = false;
      this.chatDto.chatType = data.chatType;
    });
  }
  filterUser(){
  }
  setPrivateValidation(): void{
  }

  ngAfterContentInit(): void {
    this.GetUsers();
  }

}
