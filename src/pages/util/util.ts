import { AlertController } from 'ionic-angular';

export class Util {

  constructor(public alertCtrl: AlertController) {
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Excluir',
      message: 'Deseja realmente excluir?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }


}