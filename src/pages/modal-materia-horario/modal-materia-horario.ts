import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {Md5} from 'ts-md5/dist/md5';


@IonicPage()
@Component({
  selector: 'page-modal-materia-horario',
  templateUrl: 'modal-materia-horario.html',
})
export class ModalMateriaHorarioPage {

  public md5: Md5;
  public horario = {
    id: "",
    inicio: "08:59",
    fim: "10:59",
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
    //this.horario = new horario()
    //alert(JSON.stringify(this.horario))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalMateriaHorarioPage');
  }

  fecharModalMateriaHorario() {
    //alert(JSON.stringify(this.horario))
    this.view.dismiss();
  }
  
  adicionarHorario() {
    let h = new Date().toISOString();
    this.horario.id =  Md5.hashStr(JSON.stringify(this.horario)+h).toString();
    this.view.dismiss(this.horario);
  }

}
