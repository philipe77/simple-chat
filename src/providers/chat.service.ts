import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './error-interceptor.service';
import { Chat } from '../models/chat';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class ChatProvider extends BaseService{

  chats: AngularFireList<Chat>;

  constructor(public http: HttpClient,
              public af:AngularFireAuth,
              public bd:AngularFireDatabase) {
    super()
    this.setChats();
  }

  create(chat:Chat, userId1:string, userId2:string) {
    return this.bd.object<Chat>(`/chats/${userId1}/${userId2}`)
    .set(chat)
    .catch(this.handlePromiseError);
  }

  getDeepChat(userId1:string, userId2:string): AngularFireObject<Chat>{
    return this.bd.object(`/chats/${userId1}/${userId2}`);
  }

  private setChats(){
    this.af.authState.subscribe((authState)=>{
      if(authState){
        this.chats =  this.bd.list<Chat>(`/chats/${authState.uid}`,
          (ref:firebase.database.Reference) => ref.orderByChild('timestamp')
        );
      }
    })
  }

  updatePhoto(chat:AngularFireObject<Chat>, chatPhoto:string, recipientUserPhoto:string):Promise<boolean>{
    if(chatPhoto != recipientUserPhoto){
      return chat.update({
        photo:recipientUserPhoto
      }).then(()=>{
        return true;
      }).catch(this.handlePromiseError)
    }
    return Promise.resolve(false);
  }

}
