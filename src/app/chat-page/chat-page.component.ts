import {AfterContentChecked, AfterContentInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {SignalrService} from '../../Services/signalr.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../../Services/user.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';
import {ChatService} from '../../Services/chat.service';
import {ChatDto} from '../../Dto/ChatDto';
import {Chat} from '../../Models/Chat';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, OnDestroy {

  title = 'chat-ui';
  public hideJoin: boolean;
  public userName: string;
  public  text: string;
  public chats: ChatDto[];
  public contextMessageMenu = false;
  preloader = false;
  public selectedType: string;

  public connectionUrl = 'https://localhost:44322/hub/chat';

  private connection: HubConnection;

  constructor(private http: HttpClient,
              private userService: UserService,
              public signalRService: SignalrService,
              private  chatService: ChatService) {
  }

  ngOnInit(): void {
    this.signalRService.connect();
    this.preloader = true;
    this.chatService.getChats(this.userService.getUser().id).subscribe(data => {
      this.chats = data;
      console.log(this.chats);
      this.preloader = false;
      this.signalRService.chats = this.chats;
    });

  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.signalRService.disconnect();
  }
  @HostListener('window:becquerel', ['$event'])
  reloadNotification($event: any) {
    this.signalRService.disconnect();
  }
  sendMessage(): void {

    // you can send the messge direclty to the hub or use the api controller.
    // choose wisely
    // this.signalRService.sendMessageToApi(this.text).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });

    this.signalRService.sendMessageToHub(this.text, this.signalRService.selectedChat.id).subscribe({
      next: _ => {
        this.text = '';
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.signalRService.disconnect();
  }

  selectChat(chat: ChatDto): void{
    // this.signalRService.disconnect();
    this.preloader = true;
    this.chatService.getChat(chat.id).subscribe(data => {
      this.signalRService.selectedChat = data;
      this.signalRService.messages = data.messages;

      this.preloader = false;
    });
  }

}
