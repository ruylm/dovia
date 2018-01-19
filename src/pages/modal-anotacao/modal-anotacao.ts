import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-anotacao',
  templateUrl: 'modal-anotacao.html',
})
export class ModalAnotacaoPage {

  public descricao = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private view: ViewController) {
  }
  
  save() {
    this.view.dismiss(this.descricao);
  }

  fecharModal() {
    this.view.dismiss();
  }


}
