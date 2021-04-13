import {AfterContentChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {SignalrService} from '../../Services/signalr.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UserService} from '../../Services/user.service';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import {HubConnection, HubConnectionBuilder} from '@microsoft/signalr';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit {

  title = 'chat-ui';
  public messages: any;
  public hideJoin: boolean;
  public userName: string;
  public  text: string;
  public connectionUrl = 'https://localhost:44322/hub/chat';

  private connection: HubConnection;

  constructor(private http: HttpClient, private userService: UserService) {
  }

  ngOnInit(): void {
    this.initWebSocket();
  }
  initWebSocket() {
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:44322/hub/chat')
      .build();
    this.connection.start();
    this.connection.on('messageReceived', (from: string, body: string) => {
      console.log({ from, body });
    });

    this.connection.on('userJoined', user => {
      if (user === this.userName) {
        this.hideJoin = true;
      }
      this.messages.push({ from: '> ', body: user + ' joined' });
    });

    this.connection.on('userLeft', user => {
      this.messages.push({ from: '! ', body: user + ' has left!' });
    });
  }

  sendMessage(): void {

    const promise = this.connection.invoke('Send', this.userService.getUser().name , this.text, '35ad00a7-7fd7-4167-8dc1-08d8fdc3862c')
      .then(() => { console.log('message sent successfully to hub'); })
      .catch((err) => console.log('error while sending a message to hub: ' + err));

  }

}
