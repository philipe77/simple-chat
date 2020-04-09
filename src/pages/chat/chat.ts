import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';
import { AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Message } from '../../models/message';
import { MessageService } from '../../providers/message.service';
import { Chat } from '../../models/chat';
import { ChatProvider } from '../../providers/chat.service';
import { Observable } from 'rxjs';
import firebase from 'firebase'


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  messages: AngularFireList<Message>;;
  pageTitle: string
  sender: User;
  recipient: User;
  viewMessages: Observable<Message[]>;


  private chat1: AngularFireObject<Chat>;
  private chat2: AngularFireObject<Chat>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public authService: AuthService,
    public userService: UserService,
    public chatService: ChatProvider,
    public messageService: MessageService) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }

  ionViewDidLoad() {

    this.recipient = this.navParams.get('userRecipient');
    this.pageTitle = this.recipient.nome;

    this.userService
      .mapObjectKey<User>(this.userService.currentUser)
      .first()
      .subscribe((currentUser: User) => {
        this.sender = currentUser;

        this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);
        this.chat2 = this.chatService.getDeepChat(this.recipient.$key, this.sender.$key);

        if(this.recipient.photo){
          this.chatService.mapObjectKey(this.chat1)
          .first()
          .subscribe((chat:Chat)=>{
            this.chatService.updatePhoto(this.chat1, chat.photo, this.recipient.photo); 
          })
        }


        let doSubscription = () => {
          this.viewMessages = this.messageService.mapListKeys<Message>(this.messages);
          this.viewMessages
            .subscribe((messages: Message[]) => {
              console.log(messages)
              this.scrollToBottom()
            });
        };

        this.messages = this.messageService
          .getMessages(this.sender.$key, this.recipient.$key);

        this.messages
          .valueChanges()
          .first()
          .subscribe((messages: Message[]) => {

            if (messages.length === 0) {

              this.messages = this.messageService
                .getMessages(this.recipient.$key, this.sender.$key);

              doSubscription();

            } else {
              doSubscription();
            }

          });

      });

  }


  sendMessage(newMessage: string) {
    if (newMessage) {

      let currenTime: Object = firebase.database.ServerValue.TIMESTAMP
      let senderMsg: Message = {
        userId: this.sender.$key,
        text: newMessage,
        timestamp: currenTime
      }
      this.messageService.create(senderMsg, this.messages)
        .then(() => {
          this.chat1.update({
            lastMessage: newMessage,
            timestamp: currenTime
          })

          this.chat2.update({
            lastMessage: newMessage,
            timestamp: currenTime
          })
        });
    }
  }

  private scrollToBottom(duration?: number) {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duration || 300)
      }
    }, 50)
  }
}
