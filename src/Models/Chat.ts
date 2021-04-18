import {User} from '../Models/User';
import {Message} from './Message';
import {UserDto} from '../Dto/UserDto';

export class Chat {
  public id: string;
  public name: string;
  public users: UserDto[];
  public messages: Message[];
  public chatType: string;
  public  adminId: string;
}
