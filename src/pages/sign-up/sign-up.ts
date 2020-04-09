import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Loading,
  LoadingController,
  AlertController
} from 'ionic-angular';
import {
  FormGroup,
  FormBuilder,
  Validators
} from '@angular/forms';

import { UserService } from '../../providers/user.service';
import { User } from '../../models/user';
import { AuthService } from '../../providers/auth.service';

import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

  signUpForm: FormGroup;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCrtl: AlertController,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private fireAuth: AngularFireAuth) {


    this.signUpForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      uId: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ionViewDidLoad() {
  }

  onSubmit() {

    let loading: Loading = this.showLoading();
    let formUser = this.signUpForm.value;

    let credential = {
      email: formUser.email,
      senha: formUser.uId
    }

    //Verificando se o username do usuario existe
    this.userService.userExists(formUser.username).first()
      .subscribe((existe: boolean) => {
        if (!existe) {
          //authenticando usuário
          this.authService.signUp(credential).then(
            () => {
              delete formUser.uId;
              console.log("cadastrado no authentication do firebase")
              this.fireAuth.authState.subscribe(user => {  
                //cadastrando usuario
                this.userService.save(formUser, user.uid).then(() => {
                  loading.dismiss();
                  console.log('Contato salvo com sucesso')
                  this.navCtrl.setRoot(HomePage)
                })
              })
            }
            , error => {
              loading.dismiss();
              this.showAlert(error)
          })
        } else {
          this.showAlert(`O username ${formUser.username} já existe. Tente outro Username`)
          loading.dismiss();
        }
      })


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