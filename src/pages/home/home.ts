import { Component } from '@angular/core';
import { DataBaseProvider } from '../../providers/database/database';
import { NavController, NavParams, Tabs, AlertController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    DataBaseProvider,
    PhotoViewer
  ]
})
export class HomePage {

  private pathInicial: string = this.file.dataDirectory;
  private pastaFotos: string = "csfotos";
  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  private pastaExtra: string = "Extra";

  public anotacoes;
  public fotosRecentes = [];

  tab: Tabs;

  constructor(public navCtrl: NavController, private photoViewer: PhotoViewer, public alertCtrl: AlertController, public navParams: NavParams, private file: File, private dataBase: DataBaseProvider) {

    this.tab = this.navCtrl.parent;
  }

  trocaPagina(pagina: string) {
    if (pagina === 'FotoPage') {
      this.dataBase.setTipoFoto(1);
      this.tab.select(1);
    }
    else if (pagina === 'FotoExtraPage') {
      this.dataBase.setTipoFoto(2);
      this.tab.select(1);
    }
    else if (pagina === 'MateriaPage') {
      this.tab.select(2);
      //this.navCtrl.push(MateriaPage)
    }
    else if (pagina === 'CalendarioPage') {
      this.tab.select(3);
      //this.navCtrl.push(ConfigPage)
    }
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    // Criando diretorio "Padrao de fotos" caso nao exista.
    await this.verificaDiretorio(this.pathInicial, this.pastaFotos);
    await this.verificaDiretorio(this.pathNovo, this.pastaExtra);
    this.anotacoes = await this.dataBase.getAnotacoesOrdenadas(1);
    this.buscarFotosRecentes();
  }

  visualizarNotificacao(item) {
    let mensagem = item.split("-", 2)[1]
    let alerta = this.alertCtrl.create({
      title: item.split("-", 2)[0],
      subTitle: item.split("-", 2)[1],
      buttons: ['OK'],
    });
    alerta.present();
  }

  recuperarUltimasFotos() {
    alert("ARecuperando fotos atuais...")

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
            nomeMateria = nomeMateria.substring(0,13).trim() + "..."
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