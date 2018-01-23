import { Component } from '@angular/core';
import { IonicPage, ViewController, ModalController, NavParams, ActionSheetController, ToastController, NavController, Platform } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/database/database';
import { Md5 } from 'ts-md5/dist/md5';
import { File } from '@ionic-native/file';
declare var AdMob: any;

@IonicPage()
@Component({
  selector: 'page-modal-materia',
  templateUrl: 'modal-materia.html',
  providers: [
    DataBaseProvider
  ]
})
export class ModalMateriaPage {

  private admobId: any
  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  private controleEditar;
  public materiaEditar;
  public listaHorario = [];
  private nomeAntesEditar;


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
        dom: false,
        seg: false,
        ter: false,
        qua: false,
        qui: false,
        sex: false,
        sab: false,
        diasFormatados: ""
      }
    ]
  }

  constructor(private view: ViewController, private platform: Platform, public navCtrl: NavController, public toastCtrl: ToastController, public actionsheetCtrl: ActionSheetController, private modal: ModalController, private dataBase: DataBaseProvider, params: NavParams, private file: File) {

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

    this.materiaEditar = params.get('materia');

    if (this.materiaEditar === undefined) {
      this.listaHorario = [];
      this.controleEditar = false;
    }
    else {
      this.materia = this.materiaEditar;
      this.listaHorario = this.materia.horario;
      this.controleEditar = true;
      this.nomeAntesEditar = this.materiaEditar.nome;
    }
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    try {await this.hideBanner('bottom');} catch (error) {}
    await this.createBanner();
  }

  ionViewWillLeave() {
    this.hideBanner('bottom');
  }

  fecharModalMateria() {
    this.view.dismiss();
  }

  async salvarHorario(metodo?: string) {

    try {
      if (this.materia.nome === undefined || this.materia.nome === "" || this.materia.nome.trim() === "") {
        this.presentToast('Nome é obrigatório!');
        return;
      }
      this.materia.nome = this.materia.nome.trim();
      let registroJaExiste = await this.isRegistroDuplicado(this.materia.nome);

      let retornoBDHorarios = this.dataBase.getMaterias();
      let horariosValidos = this.validaHorarioCadastradoEmOutraMateria(retornoBDHorarios, this.listaHorario);
      if (!horariosValidos) {
        return;
      }

      if (this.controleEditar === true) {
        // alert("Nome Antes: " + this.nomeAntesEditar + " Nome Depois: " + this.materiaEditar.nome)
        if (this.materiaEditar.nome !== this.nomeAntesEditar) {
          if (registroJaExiste) {
            this.presentToast('Ja existe uma materia cadastrada com esse nome!');
            return;
          }
        }
        await this.dataBase.removeMateria("id", this.materiaEditar.id);
      }
      else {
        if (registroJaExiste) {
          this.presentToast('Ja existe uma materia cadastrada com esse nome!');
          return;
        }
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
        // Verifica se pasta ja existe para salvar as fotos, se nao cria.
        this.verificaDiretorio(this.materia.nome);
      } else {
        //alert("NomeAntes: " + this.nomeAntesEditar + "NomeNovo: " +this.materiaEditar.nome)
        if (!this.materiaEditar.nome === this.nomeAntesEditar) {
          this.renomeiaDiretorioMateria(this.nomeAntesEditar, this.materia.nome);
        }
      }

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

  validaHorarioCadastradoEmOutraMateria(retBD, listHoras) {
    if (retBD.materias !== undefined) {

      const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
      let dataSalvandoInico = new Date();
      let dataSalvandoFim = new Date();
      let dataJaCadastradaInicio = new Date()
      let dataJaCadastradaFim = new Date()

      for (let materiaBD of retBD.materias) {
        if (materiaBD.horario !== undefined) {
          for (let horarioBD of materiaBD.horario) {
            for (let materiaNova of listHoras) {
              for (let dia of diasSemana) {
                //alert("materiaBD[" + dia + "]: " + horarioBD[dia] + " materiaNova[" + dia + "]" + materiaNova[dia])
                if (horarioBD[dia] && materiaNova[dia]) {

                  //if (horarioBD[dia] && horarioSendoSalvo[dia]) {
                  dataSalvandoInico.setHours(materiaNova["inicio"].split(":", 2)[0])
                  dataSalvandoInico.setMinutes(materiaNova["inicio"].split(":", 2)[1])
                  dataSalvandoInico.setSeconds(0);
                  dataSalvandoFim.setHours(materiaNova["fim"].split(":", 2)[0])
                  dataSalvandoFim.setMinutes(materiaNova["fim"].split(":", 2)[1])
                  dataSalvandoFim.setSeconds(0);

                  dataJaCadastradaInicio.setHours(horarioBD["inicio"].split(":", 2)[0])
                  dataJaCadastradaInicio.setMinutes(horarioBD["inicio"].split(":", 2)[1])
                  dataJaCadastradaInicio.setSeconds(0);
                  dataJaCadastradaFim.setHours(horarioBD["fim"].split(":", 2)[0])
                  dataJaCadastradaFim.setMinutes(horarioBD["fim"].split(":", 2)[1])
                  dataJaCadastradaFim.setSeconds(0);

                  if ((dataSalvandoInico > dataJaCadastradaInicio) && (dataSalvandoInico < dataJaCadastradaFim)) {
                    this.presentToast('Horário em conflito com outro já cadastrado na matéria ' + JSON.stringify(materiaBD.nome));
                    return false;
                  }
                  else if ((dataSalvandoFim > dataJaCadastradaInicio) && (dataSalvandoFim < dataJaCadastradaFim)) {
                    this.presentToast('Horário em conflito com outro já cadastrado na matéria ' + JSON.stringify(materiaBD.nome));
                    return false;
                  }
                  else if ((dataSalvandoInico < dataJaCadastradaInicio) && (dataSalvandoFim > dataJaCadastradaFim)) {
                    this.presentToast('Horário em conflito com outro já cadastrado na matéria ' + JSON.stringify(materiaBD.nome));
                    return false;
                  }
                  else if ((dataSalvandoInico > dataJaCadastradaInicio) && (dataSalvandoFim < dataJaCadastradaFim)) {
                    this.presentToast('Horário em conflito com outro já cadastrado na matéria ' + JSON.stringify(materiaBD.nome));
                    return false;
                  }
                  // Nao pode mesmo dia da semana com horario igual
                  else if ((dataSalvandoInico.toString() === dataJaCadastradaInicio.toString()) || (dataSalvandoFim.toString() === dataJaCadastradaFim.toString())) {
                    this.presentToast('Horário em conflito com outro já cadastrado na matéria ' + JSON.stringify(materiaBD.nome));
                    return false;
                  }

                }
              }
            }
          }
        }
      }
    }
    return true;
  }

  abrirNovoHorario() {
    const modal = this.modal.create('ModalMateriaHorarioPage');

    modal.onWillDismiss((data) => {

      let novoHorario = "";

      if (data != undefined) {

        let virgula = false;

        if (data.dom) { novoHorario = "Dom"; virgula = true }
        if (data.seg) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Seg"; virgula = true }
        if (data.ter) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Ter"; virgula = true }
        if (data.qua) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Qua"; virgula = true }
        if (data.qui) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Qui"; virgula = true }
        if (data.sex) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Sex"; virgula = true }
        if (data.sab) { if (virgula) { novoHorario = novoHorario + ", " } novoHorario = novoHorario + "Sab"; virgula = true }

        data.diasFormatados = novoHorario;

        this.materia.horario = (data);

        let horarioValido = this.isHorarioValido(this.listaHorario, this.materia.horario)
        if (horarioValido) {
          this.listaHorario.push(this.materia.horario)
        }

      }

    })

    modal.present();
  }

  isHorarioValido(harariosJainclusos, horarioSendoSalvo) {

    // let dataSalvandoInico1 = new Date();
    // let dataSalvandoFim1 = new Date();

    // dataSalvandoInico1.setHours(horarioSendoSalvo["inicio"].split(":", 2)[0])
    // dataSalvandoInico1.setMinutes(horarioSendoSalvo["inicio"].split(":", 2)[1])
    // dataSalvandoInico1.setSeconds(0);
    // dataSalvandoFim1.setHours(horarioSendoSalvo["fim"].split(":", 2)[0])
    // dataSalvandoFim1.setMinutes(horarioSendoSalvo["fim"].split(":", 2)[1])
    // dataSalvandoFim1.setSeconds(0);

    // if (dataSalvandoFim1 < dataSalvandoInico1) {
    //   this.presentToast('Data Final não pode ser menor que a Data Inicial!');
    //   return false;
    // }

    const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

    for (let horarioBD of harariosJainclusos) {

      let dataSalvandoInico = new Date();
      let dataSalvandoFim = new Date();
      let dataJaCadastradaInicio = new Date()
      let dataJaCadastradaFim = new Date()

      for (let dia of diasSemana) {
        if (horarioBD[dia] && horarioSendoSalvo[dia]) {
          dataSalvandoInico.setHours(horarioSendoSalvo["inicio"].split(":", 2)[0])
          dataSalvandoInico.setMinutes(horarioSendoSalvo["inicio"].split(":", 2)[1])
          dataSalvandoInico.setSeconds(0);
          dataSalvandoFim.setHours(horarioSendoSalvo["fim"].split(":", 2)[0])
          dataSalvandoFim.setMinutes(horarioSendoSalvo["fim"].split(":", 2)[1])
          dataSalvandoFim.setSeconds(0);

          dataJaCadastradaInicio.setHours(horarioBD["inicio"].split(":", 2)[0])
          dataJaCadastradaInicio.setMinutes(horarioBD["inicio"].split(":", 2)[1])
          dataJaCadastradaInicio.setSeconds(0);
          dataJaCadastradaFim.setHours(horarioBD["fim"].split(":", 2)[0])
          dataJaCadastradaFim.setMinutes(horarioBD["fim"].split(":", 2)[1])
          dataJaCadastradaFim.setSeconds(0);

          if ((dataSalvandoInico > dataJaCadastradaInicio) && (dataSalvandoInico < dataJaCadastradaFim)) {
            this.presentToast('Horário em conflito com outro já cadastrado!');
            return false;
          }
          else if ((dataSalvandoFim > dataJaCadastradaInicio) && (dataSalvandoFim < dataJaCadastradaFim)) {
            this.presentToast('Horário em conflito com outro já cadastrado!');
            return false;
          }
          else if ((dataSalvandoInico < dataJaCadastradaInicio) && (dataSalvandoFim > dataJaCadastradaFim)) {
            this.presentToast('Horário em conflito com outro já cadastrado!');
            return false;
          }
          else if ((dataSalvandoInico > dataJaCadastradaInicio) && (dataSalvandoFim < dataJaCadastradaFim)) {
            this.presentToast('Horário em conflito com outro já cadastrado!');
            return false;
          }
          // Nao pode mesmo dia da semana com horario igual
          else if ((dataSalvandoInico.toString() === dataJaCadastradaInicio.toString()) || (dataSalvandoFim.toString() === dataJaCadastradaFim.toString())) {
            this.presentToast('Horário em conflito com outro já cadastrado!');
            return false;
          }
        }
      }
    }
    return true;
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

  async renomeiaDiretorioMateria(nomeAntigo, nomeNovo) {
    try {
      await this.file.moveDir(this.pathNovo, nomeAntigo, this.pathNovo, nomeNovo)
      //alert("Diretorio "+materia+" ja existe");
    } catch (error) {
      alert("Erro ao renomear pasta de " + nomeAntigo + " para " + nomeNovo + " -- Erro: " + JSON.stringify(error));
    }
  }

  async isRegistroDuplicado(materiaNome) {
    try {
      await this.file.checkDir(this.pathNovo, materiaNome)
      //alert("Diretorio "+materia+" ja existe");
      return true;
    } catch (error) {
      return false;
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
