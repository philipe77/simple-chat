import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.components';
import { AlertController, App, MenuController } from 'ionic-angular';
import { AuthService } from '../../providers/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'custom-logged-header',
  templateUrl: 'custom-logged-header.html'
})
export class CustomLoggedHeaderComponent extends BaseComponent{

  @Input() title: string;
  @Input() user: User;

  constructor(public alertCrtl:AlertController,
              public authService:AuthService,
              public app:App,
              public menuCtrl:MenuController) {
   super(alertCrtl, authService, app, menuCtrl);
  }
}
