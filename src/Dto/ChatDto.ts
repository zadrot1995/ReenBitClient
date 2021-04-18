import {User} from '../Models/User';
import {Message} from '@angular/compiler/src/i18n/i18n_ast';

export class ChatDto {
  public id: string;
  public name: string;
  public chatType: string;
  public adminId: string;
}
