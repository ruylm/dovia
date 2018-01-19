import { Component } from '@angular/core';
import { IonicPage, NavController, ModalController, ActionSheetController, Platform } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/database/database';
import { File } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-materia',
  templateUrl: 'materia.html',
  providers: [
    DataBaseProvider
  ]
})
export class MateriaPage {
  
  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  public materiasCadastradas = {};
  public platform: Platform;

  constructor(public navCtrl: NavController, public modal: ModalController, private file: File, public actionsheetCtrl: ActionSheetController, private dataBase: DataBaseProvider) {
    this.materiasCadastradas = dataBase.getMaterias();
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
            this.dataBase.removeMateria("id", materia.id);
            this.removePastaMateria(materia.nome)
            this.materiasCadastradas = this.dataBase.getMaterias();
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

  async removePastaMateria(materiaNome) {
    try {
      //alert("Removendo Diretorio "+materiaNome);
      await this.file.removeDir(this.pathNovo, materiaNome)
    } catch (error) {
      alert("Ocorreu um erro ao remover diretorio: " + error);
    }
  }


}
