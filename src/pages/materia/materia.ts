import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ActionSheetController, Tabs, Platform, AlertController } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/database/database';
import { File } from '@ionic-native/file';

declare var AdMob: any;

@IonicPage()
@Component({
  selector: 'page-materia',
  templateUrl: 'materia.html',
  providers: [
    DataBaseProvider
  ]
})
export class MateriaPage {

  public unregisterBackButtonAction: any;

  private admobId: any

  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  public materiasCadastradas = {};

  tab: Tabs;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, private platform: Platform, public nav: NavController, public modal: ModalController, private file: File, public actionsheetCtrl: ActionSheetController, private dataBase: DataBaseProvider) {

    this.tab = this.navCtrl.parent;

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
    this.materiasCadastradas = dataBase.getMaterias();


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
  hideBanner(position) {
    this.platform.ready().then(() => {
      if (AdMob) {
        AdMob.hideBanner();
      }
    });
  }
  // FIM DO BLOCO COM COISAS DO ADMOB

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    try {await this.hideBanner('bottom');} catch (error) {}
    await this.createBanner();
  }

  ionViewWillLeave() {
    this.hideBanner('bottom');
  }

  abrirModalMateria(materia?: Object) {
    const modal = this.modal.create('ModalMateriaPage', { materia: materia });

    modal.onWillDismiss((data) => {

      this.materiasCadastradas = this.dataBase.getMaterias();

    })

    modal.present();
  }

  abrirGaleria(materia: string) {
    this.navCtrl.push("AlbumGaleriaPage", { nome: materia });
  }

  // Funcao usada para quando o cliente "Press" na materia
  exibirAcoes(materia) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'O que deseja fazer',
      //cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Apagar',
          role: 'destructive',
          //icon: !this.platform.is('ios') ? 'trash' : null,
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
            this.showConfirm(materia);
            // this.dataBase.removeMateria("id", materia.id);
            // this.removePastaMateria(materia.nome)
            // this.materiasCadastradas = this.dataBase.getMaterias();
          }
        },
        {
          text: 'Editar',
          //icon: !this.platform.is('ios') ? 'share' : null,
          icon: 'create',
          handler: () => {
            console.log('Editar clicked');
            this.abrirModalMateria(materia);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel', // will always sort to be on the bottom
          //icon: !this.platform.is('ios') ? 'close' : null,
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showConfirm(materia) {
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
            this.dataBase.removeMateria("id", materia.id);
            this.removePastaMateria(materia.nome)
            this.materiasCadastradas = this.dataBase.getMaterias();
          }
        }
      ]
    });
    confirm.present();
  }

  async removePastaMateria(materiaNome) {
    try {
      //alert("Removendo Diretorio "+materiaNome);
      await this.file.removeDir(this.pathNovo, materiaNome)
    } catch (error) {
      alert("Ocorreu um erro ao remover diretorio: " + error);
    }
  }


}
