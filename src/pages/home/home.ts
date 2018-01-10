import { Component } from '@angular/core';
import { DataBaseProvider } from '../../providers/database/database';
import { NavController, NavParams, Tabs } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    DataBaseProvider
  ]
})
export class HomePage {

  private pathInicial: string = this.file.dataDirectory;
  private pastaFotos: string = "csfotos";
  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  private pastaExtra: string = "Extra";

  tab: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File) {
    
    this.tab = this.navCtrl.parent;
  }

  trocaPagina(pagina: string) {
    if (pagina === 'FotoPage') {
      this.tab.select(1);
      //this.navCtrl.push(AlbumPage)
    }
    // else if (pagina === 'AlbumPage') {
    //   this.tab.select(2);
    //   //this.navCtrl.push(AlbumPage)
    // }
    else if (pagina === 'MateriaPage') {
      this.tab.select(2);
      //this.navCtrl.push(MateriaPage)
    }
    else if (pagina === 'ConfigPage') {
      this.tab.select(3);
      //this.navCtrl.push(ConfigPage)
    }
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    // Criando diretorio "Padrao de fotos" caso nao exista.
    await this.verificaDiretorio(this.pathInicial, this.pastaFotos);
    await this.verificaDiretorio(this.pathNovo, this.pastaExtra);
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
}