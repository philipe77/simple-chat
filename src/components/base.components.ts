import { NavController, AlertController, App, MenuController } from "ionic-angular";
import { AuthService } from "../providers/auth.service";
import { OnInit } from "@angular/core";

export abstract class BaseComponent implements OnInit{

    protected navCtrl: NavController;

    constructor(public alertCrtl:AlertController,
                public authService:AuthService,
                public app:App,
                public menuCtrl:MenuController,
                ){}

    ngOnInit(){
        this.navCtrl = this.app.getActiveNavs()[0];
           
    }

    onLogout(){
        this.alertCrtl.create({
            message:'Você deseja sair?',
            buttons:[
                {
                    text:'Sim',
                    handler: ()=>{
                        this.authService.logout()
                        .then(()=>{
                            this.navCtrl.setRoot('SigninPage');
                            this.menuCtrl.enable(false)
                        });
                    }
                },
                {
                    text:'Não'
                }
            ]
        }).present()
    }
}