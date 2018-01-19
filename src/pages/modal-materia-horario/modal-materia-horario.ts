import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';


@IonicPage()
@Component({
  selector: 'page-modal-materia-horario',
  templateUrl: 'modal-materia-horario.html',
})
export class ModalMateriaHorarioPage {

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

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, private view: ViewController) {
    //this.horario = new horario()
    //alert(JSON.stringify(this.horario))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalMateriaHorarioPage');
  }

  fecharModalMateriaHorario() {
    this.view.dismiss();
  }

  adicionarHorario() {

    let dataSalvandoInico1 = new Date();
    let dataSalvandoFim1 = new Date();
    dataSalvandoInico1.setHours(Number (this.horario.inicio.split(":", 2)[0]))
    dataSalvandoInico1.setMinutes(Number (this.horario.inicio.split(":", 2)[1]))
    dataSalvandoInico1.setSeconds(0);
    dataSalvandoFim1.setHours(Number (this.horario.fim.split(":", 2)[0]))
    dataSalvandoFim1.setMinutes(Number (this.horario.fim.split(":", 2)[1]))
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
