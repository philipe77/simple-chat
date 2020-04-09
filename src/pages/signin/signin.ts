import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';
import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  signInForm: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder:FormBuilder,
              private loadingCtrl:LoadingController,
              private alertCrtl: AlertController,
              private authService:AuthService) {

  this.signInForm =  formBuilder.group({
        email:['',[Validators.required, Validators.email]],
        uId:['',[Validators.required, Validators.minLength(6)]]
      })
  }

  ionViewDidLoad() {
  }

  onSubmit(){
    let loading: Loading = this.showLoading();
    let userLogin = this.signInForm.value;
    
    this.authService.signWithEmail(userLogin).then(resp =>{
      loading.dismiss();
      if(resp){
        this.navCtrl.setRoot(HomePage)
      }else{
        this.showAlert('Usuário não cadastrado')
      }
    },err =>{
      loading.dismiss();
      this.showAlert('Usuário não existe')
    })
  }

  onSignUp(){
    this.navCtrl.push('SignUpPage');
  }

    //metodo que retorna um loading na tela
    private showLoading(): Loading {
      let loading: Loading = this.loadingCtrl.create({
        content: 'Aguarde...'
      })
      loading.present();
      return loading;
    }
  
    //metodo que retorna erro por um alert
    private showAlert(msg) {
      this.alertCrtl.create({
        message: msg,
        buttons: ['OK']
      }).present();
    }

}
