import {AfterContentChecked, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
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
export class ChatPageComponent implements OnInit, OnDestroy {

  title = 'chat-ui';
  public messages: any;
  public hideJoin: boolean;
  public userName: string;
  public  text: string;
  public connectionUrl = 'https://localhost:44322/hub/chat';

  private connection: HubConnection;

  constructor(private http: HttpClient, private userService: UserService, public signalRService: SignalrService) {
  }

  ngOnInit(): void {
    this.signalRService.connect();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    this.signalRService.disconnect();
  }
  sendMessage(): void {

    // you can send the messge direclty to the hub or use the api controller.
    // choose wisely
    // this.signalRService.sendMessageToApi(this.text).subscribe({
    //   next: _ => this.text = '',
    //   error: (err) => console.error(err)
    // });

    this.signalRService.sendMessageToHub(this.text).subscribe({
      next: _ => this.text = '',
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.signalRService.disconnect();
  }

}
