import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ChatDto} from '../Dto/ChatDto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public route = 'https://localhost:44322/api/chat/';
  private chatDto: ChatDto[] = [];
  constructor(private http: HttpClient) {}

  public getChats(userId: string): Observable<ChatDto[]>{
    // let params = new HttpParams();
    // params = params.append('subId', subId.toString());
    return this.http.get<ChatDto[]>(this.route + 'user/' + userId);
  }
  public getChat(Id: string): Observable<any> {

    // let params = new HttpParams();
    // params = params.append('subId', subId.toString());
    return this.http.get<any>(this.route + Id);
  }
}
