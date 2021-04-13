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
  private hideJoin: boolean;

  constructor(private http: HttpClient, private userService: UserService) { }

  private connection: HubConnection;
  public messages: Mesage[] = [];
  private connectionUrl = 'https://localhost:44322/signalr';
  private apiUrl = 'https://localhost:44322/api/chat';

  public getConnectionString() {
    return this.connection.connectionId;
  }
  // public sendMessageToApi(message: string) {
  //   return this.http.post(this.apiUrl, this.buildChatMessage(message))
  //     .pipe(tap(_ => console.log('message sucessfully sent to api controller')));
  // }
  private buildChatMessage(message: string): Mesage {
    return {
      ConnectionId: this.connection.connectionId,
      Text: message,
      DateTime: new Date(),
      To: this.userService.getUser().id
    };
  }
  initWebSocket() {
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:44384/hub/chat')
      .build();
    this.connection.start();
    this.connection.on('messageReceived', (from: string, body: string) => {
      console.log ({ from, body });
    });

    this.connection.on('userJoined', user => {
      if (user === this.userService.getUser().name) {
        this.hideJoin = true;
      }
      console.log({ from: '> ', body: user + ' joined' });
    });

    this.connection.on('userLeft', user => {
      console.log({ from: '! ', body: user + ' has left!' });
    });
  }

  sendMessage(text: string): void {

    const promise = this.connection.invoke('Send', this.userService.getUser().name , text)
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

  }
}



