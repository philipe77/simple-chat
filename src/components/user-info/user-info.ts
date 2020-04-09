import { Component, Input } from '@angular/core';
import { User } from 'firebase';


@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent {

  @Input('user-info') user:User;
  @Input() isMenu:boolean = false;

  constructor() {
   
  }
  
  ionViewDidLoad(){
    console.log(this.user)
  }
}
