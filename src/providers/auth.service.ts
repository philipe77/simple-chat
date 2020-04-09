import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { BaseService } from './error-interceptor.service';


@Injectable()
export class AuthService extends BaseService{

  constructor(public http: HttpClient, 
              public af: AngularFireAuth) {
    
      super();
  }

  signWithEmail(credentials){ 
      return this.af.auth.signInWithEmailAndPassword(credentials.email, credentials.uId)
      .then(authState=>{
          return authState !=null;
      })
      .catch(this.handlePromiseError)
      
  }

  signUp(credentials) {
    return this.af.auth.createUserWithEmailAndPassword(credentials.email,credentials.senha)
    .catch(this.handlePromiseError)
    }
    
  logout():Promise<any>{
      return this.af.auth.signOut();
  }

  get authenticated():Promise<boolean>{
      return new Promise((resolve, reject) =>{
          this.af.authState.first()
          .subscribe((authState)=>{
              authState ? resolve(true) : reject(false);
          })
      })
  }

}
