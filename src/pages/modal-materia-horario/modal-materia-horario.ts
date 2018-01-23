import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, Platform } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
declare var AdMob: any;

@IonicPage()
@Component({
  selector: 'page-modal-materia-horario',
  templateUrl: 'modal-materia-horario.html',
})
export class ModalMateriaHorarioPage {

  private admobId: any

  public md5: Md5;
  public horario = {
    id: "",
    inicio: "08:00",
    fim: "09:00",
    dom: false,
    seg: false,
    ter: false,
    qua: false,
    qui: false,
    sex: false,
    sab: false,
    diasFormatados: ""
  }

  constructor(public navCtrl: NavController, private platform: Platform, public toastCtrl: ToastController, public navParams: NavParams, private view: ViewController) {
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

  fecharModalMateriaHorario() {
    this.view.dismiss();
  }

  adicionarHorario() {

    let dataSalvandoInico1 = new Date();
    let dataSalvandoFim1 = new Date();
    dataSalvandoInico1.setHours(Number(this.horario.inicio.split(":", 2)[0]))
    dataSalvandoInico1.setMinutes(Number(this.horario.inicio.split(":", 2)[1]))
    dataSalvandoInico1.setSeconds(0);
    dataSalvandoFim1.setHours(Number(this.horario.fim.split(":", 2)[0]))
    dataSalvandoFim1.setMinutes(Number(this.horario.fim.split(":", 2)[1]))
    dataSalvandoFim1.setSeconds(0);

    if (dataSalvandoFim1 < dataSalvandoInico1) {
      this.presentToast('Data Final não pode ser menor que a Data Inicial!');
      return;
    }

    if (this.horario.dom || this.horario.seg || this.horario.ter || this.horario.qua || this.horario.qui || this.horario.sex || this.horario.sab) {
      let h = new Date().toISOString();
      this.horario.id = Md5.hashStr(JSON.stringify(this.horario) + h).toString();
      this.view.dismiss(this.horario);
    } else {
      this.presentToast('Necessário informar pelo menos um dia da semana!');
    }
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'bottom',
      cssClass: "toast"
    });
    toast.present();
  }

}
