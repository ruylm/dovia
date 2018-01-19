import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/database/database';



@IonicPage()
@Component({
  selector: 'page-anotacao',
  templateUrl: 'anotacao.html',
  providers: [
    DataBaseProvider
  ]
})
export class AnotacaoPage {

  searchQuery: string = '';
  items: string[];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public actionsheetCtrl: ActionSheetController, public navParams: NavParams, private dataBase: DataBaseProvider) {
  }

  async initializeItems() {
    this.items = await this.dataBase.getAnotacoesOrdenadas(2);
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    this.initializeItems();
  }

  async getItems(ev: any) {
    // Reset items back to all of the items
    await this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  visualizarNotificacao(item) {
    let mensagem = item.split("-", 2)[1]
    let alerta = this.alertCtrl.create({
      title: item.split("-", 2)[0],
      subTitle: item.split("-", 2)[1],
      buttons: ['OK']
    });
    alerta.present();
  }

  exibirAcoes(item) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'O que deseja fazer',
      buttons: [
        {
          text: 'Apagar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            this.removeAnotacao(this.items, item);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  async removeAnotacao(array, value) {
    try {
      // Removendo do banco de dados
      await this.dataBase.removeAnotacao(value);
      // Removendo da memoria
      await array.forEach(function (result, index) {
        if (result === value) {
          //Remove from array todasMaterias
          array.splice(index, 1);
        }
      });
      this.items = array;
    } catch (error) {
      alert("Erro: " + error)
    }
  }

}
