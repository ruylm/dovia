import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-foto',
  templateUrl: 'foto.html',
  providers: [
    Camera
  ]
})
export class FotoPage {

  private pastaExtra: string = "Extra";
  private pathNovo: string = this.file.dataDirectory + "csfotos/";
  img = "";
  tab: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, private file: File, public toastCtrl: ToastController) {

  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    // Criando diretorio "Extra" caso nao exista.
    //await this.verificaDiretorio(this.pathInicial, this.pastaFotos);
    //await this.verificaDiretorio(this.pathNovo, this.pastaExtra);
    this.tab = this.navCtrl.parent;
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

      // Pegar nome materia pelo horario
      //let materia: string = "cs_" + "Extra";

      let pathAntigo = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      let nomeAntigo = imagePath.substr(imagePath.lastIndexOf('/') + 1);


      //let nomeNovo: string = this.createFileName();

      // Verifica se diretorio existe e se nao existir, ja cria ele..
      // this.verificaDiretorio(pathNovo, materia)

      // Movendo foto do diretorio padrao para o diretorio com o nome da materia
      this.moveFileToLocalDir(pathAntigo, nomeAntigo, this.pathNovo + this.pastaExtra + "/", this.geraNomeFoto(nomeAntigo));

      this.presentToast('Foto salva na matéria ' + this.pastaExtra.substr(this.pastaExtra.lastIndexOf('_') + 1));

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