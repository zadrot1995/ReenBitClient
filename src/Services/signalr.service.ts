import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import {Mesage} from '../Models/Mesage';
import {UserService} from './user.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class SignalrService {

  private hubConnection: HubConnection;
  public messages: Mesage[] = [];
  private connectionUrl = 'https://localhost:44322/signalr';
  private apiUrl = 'https://localhost:44322/api/chat';

  constructor(private http: HttpClient, private userService: UserService) {
  }

  public connect = () => {
    this.startConnection();
    this.addListeners();
  }

  public sendMessageToApi(message: string) {
    return this.http.post(this.apiUrl, this.buildChatMessage(message))
      .pipe(tap(_ => console.log('message sucessfully sent to api controller')));
  }

  public sendMessageToHub(message: string) {
    const promise = this.hubConnection.invoke('BroadcastAsync', this.buildChatMessage(message))
      .then(() => {
        console.log('message sent successfully to hub');
      })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

    return from(promise);
  }

  public CreateUserConnection() {
    const dto = {
      UserId: this.userService.getUser().id,
      ChatId: '5c983f15-e98e-49cf-5f66-08d8ff28f033'
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

  private buildChatMessage(message: string): Mesage {
    return {
      ConnectionId: this.hubConnection.connectionId,
      Text: message,
      DateTime: new Date(),
      ChatId: '35ad00a7-7fd7-4167-8dc1-08d8fdc3862c'
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
          window.location.href = 'emailConfirmationMessage';
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
    this.hubConnection.on('messageReceivedFromApi', (data: Mesage) => {
      console.log('message received from API Controller');
      this.messages.push(data);
    });
    this.hubConnection.on('messageReceivedFromHub', (data: Mesage) => {
      console.log('message received from Hub');
      this.messages.push(data);
    });
    this.hubConnection.on('newUserConnected', _ => {
      console.log('new user connected');
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
            window.location.href = 'emailConfirmationMessage';
          },
          error => {
            console.log(error);
          }
        );
      console.log(body);
    });
  }
}



