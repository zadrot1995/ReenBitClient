import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {BehaviorSubject, from} from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import {Message} from '../Models/Message';
import {UserService} from './user.service';
import {ChatDto} from '../Dto/ChatDto';
import {Router} from '@angular/router';
import {Chat} from '../Models/Chat';
import {MessageDto} from '../Dto/MessageDto';
import {ChatService} from './chat.service';
import {ChatCreateDto} from '../Dto/ChatCreateDto';
import {ChatEditDto} from '../Dto/ChatEditDto';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: HubConnection;
  public messages: Message[] = [];
  private connectionUrl = 'https://localhost:44322/signalr';
  private apiUrl = 'https://localhost:44322/api/chat';
  public chats: ChatDto[] = [];
  public selectedChat: Chat;



  public test: BehaviorSubject<ChatDto> = new BehaviorSubject<ChatDto>(null);
  constructor(private http: HttpClient, private userService: UserService, private router: Router, private chatService: ChatService) {
  }

  public connect = () => {
    this.startConnection();
    this.addListeners();
  }

  // public sendMessageToApi(message: string) {
  //   return this.http.post(this.apiUrl, this.buildChatMessage(message))
  //     .pipe(tap(_ => console.log('message sucessfully sent to api controller')));
  // }

  public sendMessageToHub(message: string, chatId: string) {
    console.log(this.buildChatMessage(message, chatId));
    const promise = this.hubConnection.invoke('BroadcastAsync', this.buildChatMessage(message, chatId))
      .then(() => {
        console.log('message sent successfully to hub');
      })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }
  public sendDeletedMessageToHub(message: Message) {
    const messageModel = {
      Id: message.id,
      UserId: this.userService.getUser().id,
      Text: message.text,
      DateTime: new Date(),
      ChatId: message.chatId
    };
    console.log(messageModel);
    const promise = this.hubConnection.invoke('DeleteMessageAsync', messageModel)
      .then(() => {
        console.log('Deleting message');
      })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }
  public SendEditMessageToHub(message: string, chatId: string, id: string) {
    const messageModel = {
      Id: id,
      UserId: this.userService.getUser().id,
      Text: message,
      DateTime: new Date(),
      ChatId: chatId
    };
    const promise = this.hubConnection.invoke('EditMessageAsync', messageModel)
      .then(() => {
        console.log('message Edited');
      })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }

  public SendEditChatToHub(chatDto: ChatEditDto) {
    const promise = this.hubConnection.invoke('EditChatAsync', ChatEditDto)
      .then(() => {
        console.log('Chat Edited');
      })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }
  public UserLeave(chatId: string, userId: string){
    const promise = this.hubConnection.invoke('OnUserLeaveAsync', userId, chatId)
      .then(() => {
        console.log('Chat Edited');
      })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }


  public CreateUserConnection() {
    const dto = {
      UserId: this.userService.getUser().id
    };
    const promise = this.hubConnection.invoke('CreateUserConnection', dto)
      .then(() => {
        console.log('AAAAAAAAAAA');
      })
      .catch((err) => console.log('error while connection to hub: ' + err));

    return from(promise);
  }

  private getConnection(): HubConnection {
    return new HubConnectionBuilder()
      .withUrl(this.connectionUrl)
      .withHubProtocol(new MessagePackHubProtocol())
      //  .configureLogging(LogLevel.Trace)
      .build();
  }

  private buildChatMessage(message: string, chatId: string): any {
    return {
      UserName: this.userService.getUser().name,
      UserId: this.userService.getUser().id,
      Text: message,
      DateTime: new Date(),
      ChatId: chatId
    };
  }

  public  disconnect(): void{
    const body = {
      UserId: this.userService.getUser().id,
      ConnectionString: this.hubConnection.connectionId
    };
    const result = this.http.post('https://localhost:44322/api/chat/disconnect', body, httpOptions)
      .subscribe(data => {
          console.log(result);
          console.log(body);
        },
        error => {
          console.log(error);
        }
      );
    console.log(body);
  }
  private startConnection() {
    this.hubConnection = this.getConnection();

    this.hubConnection.start()
      .then(() => {
        console.log('connection started');
        this.CreateUserConnection();
      })
      .catch((err) => console.log('error while establishing signalr connection: ' + err));
  }

  private addListeners() {

    this.hubConnection.on('OnNewChatCreated', (data: any) => {
      if (this.chats.includes(data)){
      }
      else {
        console.log('New Chat');
        console.log(data);
        const chatDto = new ChatDto();
        chatDto.name = data.Name;
        chatDto.id = data.Id;
        chatDto.chatType = data.ChatType;
        chatDto.adminId = data.AdminId;
        this.chats.unshift(chatDto);
      }
      // window.location.href = '';
    });
    this.hubConnection.on('messageReceivedFromApi', (data: Message) => {
      console.log('message received from API Controller');
      this.messages.push(data);
    });
    this.hubConnection.on('messageReceivedFromHub', (data: any) => {
      console.log('message received from Hub');
      const message = new Message();
      message.id = data.Id;
      message.chatId = data.ChatId;
      message.userId = data.UserId;
      message.dateTime = data.DateTime;
      message.text = data.Text;
      message.userName = data.UserName;
      if ( this.selectedChat.id === message.chatId ){
        console.log(message);
        this.messages.push(message);
      }
    });
    this.hubConnection.on('newUserConnected', _ => {
      console.log('new user connected');
    });
    this.hubConnection.on('EditMessage', (data: any) => {
      console.log('Message edited');
      console.log('Message deleted');
      if (data.ChatId === this.selectedChat.id) {
        for (let i = 0; i < this.messages.length; i++) {

          if ((this.messages)[i].id === data.Id) {
            this.messages[i].text = data.Text;
          }
          break;
        }
      }
    });
    this.hubConnection.on('EditChat', (data: any) => {
      for (let i = 0; i < this.chats.length; i++) {
        if ((this.chats)[i].id === data.Id) {
          this.chats[i].name = data.Name;
        }
        break;
      }
      if (this.selectedChat.id === data.Id){
        this.chatService.getChat(this.selectedChat.id).subscribe(chat => {
          this.selectedChat = chat;
          this.messages = chat.messages;
        });
      }
    });
    this.hubConnection.on('DeleteMessage', (data: any) => {
      console.log('Message deleted');
      if (data.ChatId === this.selectedChat.id) {
        for (let i = 0; i < this.messages.length; i++) {

          if ((this.messages)[i].id === data.Id) {
            this.messages.splice(i, 1);
            i--;
          }
          break;
        }
      }
    });
    this.hubConnection.on('OnUserLeave', (chatId: string, userId: string) => {
      if (chatId === this.selectedChat.id) {
        for (let i = 0; i < this.selectedChat.users.length; i++) {
          if (this.selectedChat.users[i].id === userId) {
            this.selectedChat.users.splice(i, 1);
            i--;
          }
          break;
        }
      }
    });
    this.hubConnection.on('OnDisconnectedAsync', () => {
      const body = {
        UsersId: this.userService.getUser().id,
        ConnectionString: this.hubConnection.connectionId
      };
      const result = this.http.post('https://localhost:44322/api/chat/disconnect', body, httpOptions)
        .subscribe(data => {
            console.log(result);
            console.log(body);
          },
          error => {
            console.log(error);
          }
        );
      console.log(body);
    });
  }
}



