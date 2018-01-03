import { Component } from '@angular/core';
import { DataBaseProvider } from '../../providers/database/database';

import { NavController, NavParams, Tabs } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    DataBaseProvider
  ]
})
export class HomePage {

  tab: Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab = this.navCtrl.parent;
  }

  trocaPagina(pagina: string) {
    if (pagina === 'FotoPage') {
      this.tab.select(1);
      //this.navCtrl.push(FotoPage)
    }
    else if (pagina === 'AlbumPage') {
      this.tab.select(2);
      //this.navCtrl.push(AlbumPage)
    }
    else if (pagina === 'MateriaPage') {
      this.tab.select(3);
      //this.navCtrl.push(MateriaPage)
    }
    else if (pagina === 'ConfigPage') {
      this.tab.select(4);
      //this.navCtrl.push(ConfigPage)
    }
  }
}
