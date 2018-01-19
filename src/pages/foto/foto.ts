import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { DataBaseProvider } from '../../providers/database/database';


@IonicPage()
@Component({
  selector: 'page-foto',
  templateUrl: 'foto.html',
  providers: [
    Camera,
    DataBaseProvider
  ]
})
export class FotoPage {

  private pastaExtra: string = "Extra";
  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  private retornoBDHorarios;
  private tipoFoto;
  img = "";
  tab: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dataBase: DataBaseProvider, public camera: Camera, private file: File, public toastCtrl: ToastController) {
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    this.tipoFoto = this.dataBase.getTipoFoto();
    this.tab = this.navCtrl.parent;
    this.retornoBDHorarios = this.dataBase.getMaterias();
    this.tirarFoto();
  }

  tirarFoto() {

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imagePath) => {

      let pathAntigo = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      let nomeAntigo = imagePath.substr(imagePath.lastIndexOf('/') + 1);

      // Pegar nome materia pelo horario
      let materia: string = this.validaHorarioCadastradoEmOutraMateria(this.retornoBDHorarios, nomeAntigo)

      // Movendo foto do diretorio padrao para o diretorio com o nome da materia
      this.moveFileToLocalDir(pathAntigo, nomeAntigo, this.pathNovo + materia + "/", this.geraNomeFoto(nomeAntigo));

      this.presentToast('Foto salva na matéria ' + materia);

      this.tab.select(0);

    }, (err) => {
      this.tab.select(0);
      //alert('Erro ao tirar foto: ' + err)
    });
  }


  // Copy the image to a local folder
  async moveFileToLocalDir(pathAntigo, nomeAntigo, pathNovo, nomeNovo) {
    //alert("Movendo--> pathAntigo: " + pathAntigo + "    nomeAntigo: " + nomeAntigo + "    pathNovo: " + pathNovo + "    nomeNovo: " + nomeNovo);
    try {
      await this.file.moveFile(pathAntigo, nomeAntigo, pathNovo, nomeNovo);
      this.img = pathNovo + nomeNovo;
    } catch (error) {
      this.presentToast('Erro ao mover foto para diretorio correto: ' + JSON.stringify(error));
    }
  }

  // formato do nome da foto: data|importante
  geraNomeFoto(nome) {
    let nomeNovo = (nome.split(".", 1))
    return nomeNovo + "_0.jpg"
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

  validaHorarioCadastradoEmOutraMateria(retornoBDHorarios, foto) {
    
    if (retornoBDHorarios.materias !== undefined || this.tipoFoto === 2) {

      const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
      let nomeNovo = (foto.split(".", 1))
      let n: number = Number(nomeNovo[0])
      let dataFoto = new Date(n);
      dataFoto.setSeconds(0);
      let diaDaSemanaDaFoto = this.verificaDiaDaSemana(dataFoto);
      let dataJaCadastradaInicio = new Date()
      let dataJaCadastradaFim = new Date()

      for (let materiaBD of retornoBDHorarios.materias) {
        if (materiaBD.horario !== undefined) {
          for (let horarioBD of materiaBD.horario) {
            if (horarioBD[diaDaSemanaDaFoto]) {

              dataJaCadastradaInicio.setHours(horarioBD["inicio"].split(":", 2)[0])
              dataJaCadastradaInicio.setMinutes(horarioBD["inicio"].split(":", 2)[1])
              dataJaCadastradaInicio.setSeconds(0);
              dataJaCadastradaFim.setHours(horarioBD["fim"].split(":", 2)[0])
              dataJaCadastradaFim.setMinutes(horarioBD["fim"].split(":", 2)[1])
              dataJaCadastradaFim.setSeconds(0);

              if ((dataFoto > dataJaCadastradaInicio) && (dataFoto < dataJaCadastradaFim)) {
                // alert("Foto serve na materia: " + materiaBD.nome)
                return materiaBD.nome;
              }

            }
          }
        }
      }
      return this.pastaExtra;
    } else {
      return this.pastaExtra;
    }
  }

  verificaDiaDaSemana(dtFoto) {
    let diaNumerico = dtFoto.getDay();
    if (diaNumerico === 0) { return "dom" }
    else if (diaNumerico === 1) { return "seg" }
    else if (diaNumerico === 2) { return "ter" }
    else if (diaNumerico === 3) { return "qua" }
    else if (diaNumerico === 4) { return "qui" }
    else if (diaNumerico === 5) { return "sex" }
    else if (diaNumerico === 6) { return "sab" }
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom',
      cssClass: "toast"
    });
    toast.present();
  }


}