import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';

import { UserService } from '../../providers/user.service';
import { User } from '../../models/user';
import * as firebase from 'firebase/app';





@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser:User
  canEdit:boolean = false;
  uploadProgress:number;

  private filePhoto:File;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public authService:AuthService,
              
              public userService:UserService) {
        
                this.currentUser ={
                  nome:'',
                  username: '',
                  email:'',  
                }            
  }

  ionViewCanEnter():Promise<boolean>{
    return this.authService.authenticated;
  }

  ionViewWillEnter() {
    
    this.userService
    .mapObjectKey(this.userService.currentUser)
    .subscribe((user) => {
      this.currentUser = user;
      
    });
  }

  onSubmit(event:Event):void{
    event.preventDefault();
    

    if (this.filePhoto) {
      let uploadTask = this.userService.uploadPhoto(this.filePhoto, this.currentUser.$key);
      uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {
        //barra de progresso
        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      
      }, (error: Error) => {
        // catch error
      });

      uploadTask.then((UploadTaskSnapshot: firebase.storage.UploadTaskSnapshot) => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });

    } else {
      this.editUser();
    }
  }

  private editUser(photoUrl?:string){
    
    this.userService.edit({
      nome:this.currentUser.nome,
      username: this.currentUser.username,
      photo:photoUrl || this.currentUser.photo || ''
    }).then(()=>{
      this.canEdit = false;
      this.filePhoto = undefined;
      this.uploadProgress = 0;
    })
  }

  onPhoto(event){
    this.filePhoto =event.target.files[0]
  }


}
