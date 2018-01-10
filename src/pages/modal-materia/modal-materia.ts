import { Component } from '@angular/core';
import { IonicPage, ViewController, ModalController, NavParams, ActionSheetController } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/database/database';
import { Md5 } from 'ts-md5/dist/md5';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-modal-materia',
  templateUrl: 'modal-materia.html',
  providers: [
    DataBaseProvider
  ]
})
export class ModalMateriaPage {

  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  private controleEditar;
  public materiaEditar;
  public listaHorario = [];

  public materia = {
    id: "",
    nome: "",
    professor: "",
    email: "",
    whats: "",
    horario: [
      {
        id: "",
        inicio: "",
        fim: "",
        dia: [{
          dom: false,
          seg: false,
          ter: false,
          qua: false,
          qui: false,
          sex: false,
          sab: false
        }],
        diasFormatados: ""
      }
    ]
  }

  constructor(private view: ViewController, public actionsheetCtrl: ActionSheetController, private modal: ModalController, private dataBase: DataBaseProvider, params: NavParams, private file: File) {

    this.materiaEditar = params.get('materia');

    if (this.materiaEditar === undefined) {
      this.listaHorario = [];
      this.controleEditar = false;
    }
    else {
      this.materia = this.materiaEditar;
      this.listaHorario = this.materia.horario;
      this.controleEditar = true;
    }
  }

  fecharModalMateria() {
    this.view.dismiss();
  }

  async salvarHorario(metodo?: string) {

    try {

      if (this.controleEditar === true) {
        await this.dataBase.removeMateria("id", this.materiaEditar.id);
      }

      let retornoBD = this.dataBase.getMaterias();

      if (retornoBD.materias === undefined) {
        retornoBD = {
          materias: []
        }
      }
      // Adicionando no nosso objeto os horario que foram criados
      this.materia.horario = this.listaHorario;

      if (this.controleEditar === false) {
        this.materia.id = Md5.hashStr((JSON.stringify(this.materia)) + new Date().toISOString()).toString();
      }
      // Verifica se pasta ja existe para salvar as fotos, senao cria.
      this.verificaDiretorio(this.materia.nome);

      retornoBD.materias.push(this.materia);

      await this.dataBase.setMaterias(retornoBD);

      if (!(metodo === "deleteItem")) {
        this.view.dismiss();
      }
    } catch (error) {
      alert("Erro: " + error)
      console.log(error);
    }
  }

  abrirNovoHorario() {
    const modal = this.modal.create('ModalMateriaHorarioPage');

    modal.onWillDismiss((data) => {

      let novoHorario = "";

      if (data != undefined) {

        let virgula = false;

        if (data.dia.dom) { novoHorario = "Dom"; virgula = true }
        if (data.dia.seg) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Seg"; virgula = true }
        if (data.dia.ter) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Ter"; virgula = true }
        if (data.dia.qua) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Qua"; virgula = true }
        if (data.dia.qui) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Qui"; virgula = true }
        if (data.dia.sex) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Sex"; virgula = true }
        if (data.dia.sab) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Sab"; virgula = true }

        data.diasFormatados = novoHorario;

        this.materia.horario = (data);
        this.listaHorario.push(this.materia.horario)
      }

    })

    modal.present();
  }

  // Funcao usada para quando o cliente "Press" na materia
  exibirAcoesHorario(aula) {
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
            if (!this.controleEditar) {
              this.removeHorarioMemoria(this.listaHorario, "id", aula.id);
            }
            else {
              this.removeHorarioMemoria(this.listaHorario, "id", aula.id);
              this.salvarHorario("deleteItem");
            }
            // this.dataBase.removeHorario("nome", materia.nome);
            // this.materiasCadastradas = this.dataBase.getMaterias();
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

  removeHorarioMemoria(array, property, value) {

    try {
      array.forEach(function (result, index) {
        if (result[property] === value) {
          //Remove from array todasMaterias
          array.splice(index, 1);
        }
      });
      this.listaHorario = array;
    } catch (error) {
      alert("Erro: " + error)
    }
  }

  async verificaDiretorio(materia) {
    try {
      await this.file.checkDir(this.pathNovo, materia)
      //alert("Diretorio "+materia+" ja existe");
    } catch (error) {
      //alert("Criando diretorio: " + materia);
      try {
        await this.file.createDir(this.pathNovo, materia, false);
        //alert("Dir criado")
      } catch (error) {
        alert("Erro ao criar pasta " + materia + " -- " + JSON.stringify(error));
      }
    }
  }

}
