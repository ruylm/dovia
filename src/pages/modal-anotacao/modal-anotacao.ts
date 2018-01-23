import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
declare var AdMob: any;

@IonicPage()
@Component({
  selector: 'page-modal-anotacao',
  templateUrl: 'modal-anotacao.html',
})
export class ModalAnotacaoPage {

  private admobId: any
  public descricao = "";

  constructor(public navCtrl: NavController, private platform: Platform, public navParams: NavParams, private view: ViewController) {
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

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    try {await this.hideBanner('bottom');} catch (error) {}
    await this.createBanner();
    this.navCtrl.setRoot('TabsPage');
  }
  ionViewWillLeave() {
    this.hideBanner('bottom');
  }

  save() {
    this.view.dismiss(this.descricao);
  }

  fecharModal() {
    this.view.dismiss();
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
