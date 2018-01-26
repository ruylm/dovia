import { Component } from '@angular/core';
import { DataBaseProvider } from '../../providers/database/database';
import { NavController, NavParams, Tabs, AlertController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FotoPage } from '../foto/foto';
import { MateriaPage } from '../materia/materia';
import { ConfigPage } from '../config/config';

declare var AdMob: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    DataBaseProvider,
    PhotoViewer
  ]
})
export class HomePage {

  private admobId: any

  private pathInicial: string = this.file.dataDirectory;
  private pastaFotos: string = "csfotos";
  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  private pastaExtra: string = "Extra";

  public anotacoes;
  public fotosRecentes = [];

  tab: Tabs;

  constructor(public navCtrl: NavController, private photoViewer: PhotoViewer, private platform: Platform, public alertCtrl: AlertController, public navParams: NavParams, private file: File, private dataBase: DataBaseProvider) {

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

    this.tab = this.navCtrl.parent;
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
  // ANUNCIO FORMATO DE PAGINA INTEIRA
  showInterstitial() {
    this.platform.ready().then(() => {
      if (AdMob) {
        AdMob.prepareInterstitial({
          adId: this.admobId.interstitial,
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
  testeRuy() {

    setInterval(function () {
      try {
        if (AdMob) {
          AdMob.hideBanner();
        }
      } catch (error) { }
      try {
        if (AdMob) {
          AdMob.createBanner({
            adId: 'ca-app-pub-2668814124977579/1899067936',
            autoShow: true
          });
        }
      } catch (error) { alert("Erroban2222: " + error) }
    }, 35000);

    // setInterval(function () {
    //   try {
    //     if (AdMob) {
    //       AdMob.hideBanner();
    //     }
    //   } catch (error) { }
    //   try {
    //     if (AdMob) {
    //       AdMob.createBanner({
    //         adId: 'ca-app-pub-2668814124977579/1899067936',
    //         autoShow: false
    //       });
    //       var positionMap = {
    //         "bottom": AdMob.AD_POSITION.BOTTOM_CENTER,
    //         "top": AdMob.AD_POSITION.TOP_CENTER
    //       };
    //       AdMob.showBanner(positionMap["top".toLowerCase()]);
    //     }
    //   } catch (error) { alert("Erroban2222: " + error) }
    // }, 20000);

    // setInterval(function () {
    //   try {
    //     if (AdMob) {
    //       if (AdMob) {
    //         AdMob.prepareInterstitial({
    //           adId: 'ca-app-pub-2668814124977579/7933815636',
    //           autoShow: true
    //         });
    //       }
    //     }
    //   } catch (error) {alert("Erroban33333: " + error) }
    // }, 30000);

  }
  // FIM DO BLOCO COM COISAS DO ADMOB

  trocaPagina(pagina: string) {
    this.hideBanner('bottom');
    if (pagina === 'FotoPage') {
      this.dataBase.setTipoFoto(1);
      //this.tab.select(1);
      this.navCtrl.push(FotoPage)
    }
    else if (pagina === 'FotoExtraPage') {
      this.dataBase.setTipoFoto(2);
      //this.tab.select(1);
      this.navCtrl.push(FotoPage)
    }
    else if (pagina === 'MateriaPage') {
      this.hideBanner('bottom');
      //this.tab.select(2);
      this.navCtrl.push(MateriaPage)
    }
    else if (pagina === 'CalendarioPage') {
      //this.tab.select(3);
      this.navCtrl.push(ConfigPage)
    }
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    try {
      // Bloco Anuncio Admob
      await this.createBanner();
      //this.testeRuy();
    } catch (error) {
      alert("Erroban: " + error)
    }
    //this.navCtrl.setRoot('HomePage');
    // Criando diretorio "Padrao de fotos" caso nao exista.
    await this.verificaDiretorio(this.pathInicial, this.pastaFotos);
    await this.verificaDiretorio(this.pathNovo, this.pastaExtra);
    this.anotacoes = await this.dataBase.getAnotacoesOrdenadas(1);
    this.buscarFotosRecentes();
  }

  visualizarNotificacao(item) {
    let alerta = this.alertCtrl.create({
      title: item.split("-", 2)[0],
      subTitle: item.split("-", 2)[1],
      buttons: ['OK'],
    });
    alerta.present();
  }


  verTodasAnotacoes() {
    this.navCtrl.push("AnotacaoPage");
  }

  async verificaDiretorio(pathNovo, materia) {

    try {
      //alert("Verificando: " + pathNovo + " -- " + materia)
      await this.file.checkDir(pathNovo, materia)
      //alert("Diretorio ja existe");
    } catch (error) {
      //alert("Criando dir Extra");
      try {
        await this.file.createDir(pathNovo, materia, false);
      } catch (error) {
        alert("Erro ao criar pasta " + materia + " -- " + JSON.stringify(error));
      }
    }

  }




  async buscarFotosRecentes() {
    let fotosMateria = [];
    let pasta: string = "";
    this.fotosRecentes = [];

    try {
      let pastasMaterias = await this.file.listDir(this.file.dataDirectory, "csfotos")

      for (let pastaMateria of pastasMaterias) {

        if (pastaMateria.isDirectory === true) {
          try {
            pasta = pastaMateria.name;
            let retorno = await this.file.listDir(this.pathNovo, pasta)

            for (let dado of retorno) {
              if (dado.isFile === true) {

                //alert("dado: " + JSON.stringify(dado))
                let splitted = dado.name.split("_", 2);

                let nomeDaFoto: number = Number((splitted[0].split(".", 1)));
                //alert("nomeFoto: " + nomeDaFoto)

                let date = new Date(nomeDaFoto);
                //alert("date: " + JSON.stringify(date))

                let nomeFormatado = JSON.stringify(date) + "_separador_" + pasta + "_separador_" + dado.nativeURL;
                //alert("Nome da Foto =   " + nomeFormatado)
                fotosMateria.push(nomeFormatado);
              }
            }

          } catch (error) {
            alert("error : " + JSON.stringify(error))
          }
        }
      }
      fotosMateria.sort();
      fotosMateria.reverse();
      for (let i = 0; i < 4; i++) {
        if (fotosMateria.length > i) {
          let separada = fotosMateria[i].split("_separador_", 3)
          // alert("separada[1]   " + separada[1])
          // alert("separada[2]   " + separada[2])
          let nomeMateria = separada[1]
          if (nomeMateria.length > 13) {
            nomeMateria = nomeMateria.substring(0, 13).trim() + "..."
          }

          let itemFoto = {
            pasta: nomeMateria,
            foto: separada[2]
          }
          this.fotosRecentes.push(itemFoto)
        }
      }
      //alert("FIM - FOTOS: " + JSON.stringify(this.fotosRecentes));

    } catch (error) {

      let itemFoto = {
        pasta: "",
        foto: ""
      }
      this.fotosRecentes.push(itemFoto);
      this.fotosRecentes.push(itemFoto);
      this.fotosRecentes.push(itemFoto);
      this.fotosRecentes.push(itemFoto);
      alert("Erro 3: " + error)
    }
  }

  abrirFoto(fotoUrl) {
    // file:///data/user/0/io.ionic.startr/files/csfotos/Extra/5151151.jpg
    this.photoViewer.show(fotoUrl);
  }



}