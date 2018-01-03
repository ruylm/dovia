import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-album',
  templateUrl: 'album.html'
})
export class AlbumPage {

  nome='';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //this.nome = navParams.get('nome');
    alert('Rennan Viadinho!')
  }

}
