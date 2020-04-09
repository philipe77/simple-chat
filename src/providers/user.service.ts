import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

/* import { map } from 'rxjs/operators/map'; */
import { BaseService } from './error-interceptor.service';

import { AngularFireDatabase, AngularFireObject } from "angularfire2/database";
import { Observable } from "rxjs";
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

@Injectable()
export class UserService extends BaseService{

  users: Observable<User[]>;
  currentUser:AngularFireObject<User>;

  constructor(public http: HttpClient, 
              public db:AngularFireDatabase,
              public firebaseApp: FirebaseApp,
              public af: AngularFireAuth) {
    
    super();
    this.listenAuthState();
  }

  //Verificar o usuário que está loggado na aplicação
  private listenAuthState():void{
    this.af.authState.subscribe((authState)=>{
      if(authState){
        this.currentUser = this.db.object(`/users/${authState.uid}`);
        
        this.setUsers(authState.uid)
      }
    })
  }

  //Lista os usuários excluindo o usuário loggado
  private setUsers(uidToExclude:string){
    this.users = this.mapListKeys<User>(
      this.db.list<User>(`/users`,
      (ref:firebase.database.Reference) => ref.orderByChild('nome')
    )
    ).map((users: User[])=>{
      return users.filter((user:User) => user.$key !== uidToExclude)
    })
    
  }

  //salvar usuário no firebase
   save(user:User,uuId:string){
    return this.db.object(`users/${uuId}`).set(user);
  } 


  //Editar usuário
  edit(user:{nome:string, username:string, photo:string}):Promise<void>{
    return this.currentUser.update(user).catch(this.handlePromiseError);
  }

  //verificar se o username do usuário existe no firebase
  userExists(username:string):Observable<boolean>{
    return this.db.list(`/users`,
      (ref)=> ref.orderByChild('username').equalTo(username))
      .valueChanges().map((users: User[]) =>{
        return users.length > 0
      }).catch(this.handleObservableError);
  }

  //retorna o usuário específico pelo seu Id 
  getUserById(userId:string):AngularFireObject<User>{
    return this.db.object<User>(`/users/${userId}`)
  }

  //recebe a photo como parametro para ser adicionada no firebase
  uploadPhoto(file:File, userId:string):firebase.storage.UploadTask{
    return this.firebaseApp.storage()
          .ref()
          .child(`/users/${userId}`)
          .put(file);
  }

}
