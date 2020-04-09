import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.components';
import { AlertController, App, MenuController, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent extends BaseComponent{

  @Input('user') currentUser:User;

  constructor(public alertCrtl:AlertController,
              public authService:AuthService,
              public app:App,
              public menuCtrl:MenuController) {

      super(alertCrtl, authService, app, menuCtrl);
  }

  onProfile():void{
    this.navCtrl.push('UserProfilePage');
  }

}
