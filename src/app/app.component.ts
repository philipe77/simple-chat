import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { User } from '../models/user';
import { UserService } from '../providers/user.service';
import { AuthService } from '../providers/auth.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any;
  currentUser:User;
  constructor(authService: AuthService,
              platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen,
              userService:UserService) {

    authService.af.authState.subscribe(auth =>{
      if(auth){
        this.rootPage = HomePage;
        userService.currentUser
        .valueChanges().subscribe((user:User)=>{
          this.currentUser = user;
        })
      }else{
        this.rootPage = 'SigninPage'
      }
    })

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

