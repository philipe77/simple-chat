import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { AngularFireModule} from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { UserService} from '../providers/user.service';
import { HttpClientModule  } from '@angular/common/http';
import { AuthService } from '../providers/auth.service';


import { CapitalizePipe } from '../pipes/capitalize.pipe';

import { ComponentsModule } from '../components/components.module';
import { ChatProvider } from '../providers/chat.service';
import { MessageService } from '../providers/message.service';

const firebaseAppConfig ={
    apiKey: FIREBASE_CONFIG.apiKey,
    authDomain: FIREBASE_CONFIG.authDomain,
    databaseURL: FIREBASE_CONFIG.databaseURL,
    projectId: FIREBASE_CONFIG.projectId,
    storageBucket: FIREBASE_CONFIG.storageBucket,
    messagingSenderId: FIREBASE_CONFIG.storageBucket
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CapitalizePipe,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig),
    HttpClientModule,
    ComponentsModule
  ],
  exports:[
    CapitalizePipe
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireDatabase,
    AngularFireAuth,
    AuthService,
    UserService,
    ChatProvider,
    MessageService,
    
    
  ]
})
export class AppModule {}
