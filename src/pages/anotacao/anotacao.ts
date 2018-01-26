import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, Platform } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/database/database';
declare var AdMob: any;


@IonicPage()
@Component({
  selector: 'page-anotacao',
  templateUrl: 'anotacao.html',
  providers: [
    DataBaseProvider
  ]
})
export class AnotacaoPage {

  private admobId: any
  searchQuery: string = '';
  items: string[];

  constructor(public navCtrl: NavController, private platform: Platform, public alertCtrl: AlertController, public actionsheetCtrl: ActionSheetController, public navParams: NavParams, private dataBase: DataBaseProvider) {
    // Coisas do admob
    this.platform = platform;
    if (/(android)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-2668814124977579/1899067936',
        interstitial: 'ca-app-pub-2668814124977579/7933815636'
      };
    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
      this.admobId = {
        banner: 'ca-app-pub-2668814124977579/1899067936',
        interstitial: 'ca-app-pub-2668814124977579/7933815636'
      };
    }
    // Fim Coisas do admob
  }

  async initializeItems() {
    this.items = await this.dataBase.getAnotacoesOrdenadas(2);
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    try { await this.hideBanner('bottom'); } catch (error) { }
    await this.createBanner();
    this.navCtrl.setRoot('TabsPage');
    this.initializeItems();
  }

  ionViewWillLeave() {
    this.hideBanner('bottom');
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
            this.showConfirm(item);
            // this.removeAnotacao(this.items, item);
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

  showConfirm(item) {
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
            this.removeAnotacao(this.items, item);
          }
        }
      ]
    });
    confirm.present();
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


  // INICIO DO BLOCO COM COISAS DO ADMOB
  createBanner() {
    this.platform.ready().then(() => {
      if (AdMob) {
        AdMob.createBanner({
          adId: this.admobId.banner,
          autoShow: true
        });
      }
    });
  }
  // ANUNCIO FORMATO BANNER
  showBanner(position) {
    this.platform.ready().then(() => {
      if (AdMob) {
        var positionMap = {
          "bottom": AdMob.AD_POSITION.BOTTOM_CENTER,
          "top": AdMob.AD_POSITION.TOP_CENTER
        };
        AdMob.showBanner(positionMap[position.toLowerCase()]);
      }
    });
  }
  hideBanner(position) {
    this.platform.ready().then(() => {
      if (AdMob) {
        AdMob.hideBanner();
      }
    });
  }
  // FIM DO BLOCO COM COISAS DO ADMOB

}
