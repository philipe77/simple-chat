import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Message } from '../models/message';
import { BaseService } from './error-interceptor.service';

@Injectable()
export class MessageService extends BaseService {

  constructor(public http: HttpClient,  public db:AngularFireDatabase) {
    super();
  }

  getMessages(userId1:string, userId2:string):AngularFireList<Message>{
    
    return this.db.list(`/messages/${userId1}-${userId2}`, 
    (ref:firebase.database.Reference)=>ref.orderByChild('timestamp').limitToLast(30)
    )
  }

  create(message:Message, listMessages:AngularFireList<Message>){
    return Promise.resolve(listMessages.push(message));
  }




}
