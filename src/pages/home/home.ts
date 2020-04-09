import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import * as firebase from 'firebase/app';

import { UserService } from '../../providers/user.service';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';
import { Observable } from 'rxjs';
import { Chat } from '../../models/chat';
import { ChatProvider } from '../../providers/chat.service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: Observable<User[]>;
  chats: Observable<Chat[]>;
  view:string = 'chats'

  constructor(public navCtrl: NavController, 
              private userService:UserService,
              private authService:AuthService,
              public chatService:ChatProvider,
              private menuCntl:MenuController) {

  }

  ionViewCanEnter():Promise<boolean>{
    return this.authService.authenticated;
  }

  ionViewWillEnter(){
    //lista os chats
    this.chats = this.chatService.mapListKeys<Chat>(this.chatService.chats)
    .map((chats:Chat[]) =>chats.reverse())
    console.log(this.chats)
    //lista de usuarios
    this.users = this.userService.users;  

    //libera menu
    this.menuCntl.enable(true);
   
  }

  onChatCreate(recipientUser:User){
    this.userService.mapObjectKey<User>(this.userService.currentUser)
    .first()
    .subscribe((currentUser:User)=>{
      this.chatService.mapObjectKey<Chat>(this.chatService.getDeepChat(currentUser.$key, recipientUser.$key))
      .first()
      .subscribe((chat:Chat)=>{
        if(!chat.title){
          let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

          let chat1: Chat = {
            lastMessage:'',
            timestamp: timestamp,
            title: recipientUser.nome,
            photo: recipientUser.photo
          };
          this.chatService.create(chat1, currentUser.$key, recipientUser.$key)

          let chat2:Chat = {
            lastMessage:'',
            timestamp: timestamp,
            title: currentUser.nome,
            photo: currentUser.photo
          }
          this.chatService.create(chat2, recipientUser.$key, currentUser.$key)
        }
        console.log("chat criado foi: "+ chat);
      })
    })
    this.navCtrl.push('ChatPage',{
      userRecipient: recipientUser
    })
  }

  onChatOpen(chat:Chat){
   let recipientUserId:string = chat.$key;
   
   
   this.userService.mapObjectKey<User>(
    this.userService.getUserById(recipientUserId)
   ).first()
   .subscribe((user:User)=>{
    this.navCtrl.push('ChatPage',{userRecipient:user})
   })
  }

  filterItems(event:any){
    let searchTerm:string = event.target.value
    
    this.chats = this.chatService.mapListKeys<Chat>(this.chatService.chats)
                  .map((chats:Chat[])=>chats.reverse())

    this.users = this.userService.users;  
    
    
    if(searchTerm){
      switch(this.view){
        case 'chats':
        this.chats = this.chats.map((chats:Chat[])=>
                     chats.filter((chat:Chat)=>
                        (chat.title && chat.title.toLowerCase()
                                                 .indexOf(searchTerm.toLowerCase())> -1)));
          break;

        case 'usuarios':
        this.users = this.users.map((users:User[])=>
                      users.filter((user:User)=> (user.nome.toLowerCase()
                                                  .indexOf(searchTerm.toLowerCase())> -1)));
          break;
      }
    }
  }

}
