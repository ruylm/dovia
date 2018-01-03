import { Component } from '@angular/core';

import { AlbumPage } from '../album/album';
import { HomePage } from '../home/home';
import { MateriaPage } from '../materia/materia';
import { ConfigPage } from '../config/config';
import { FotoPage } from '../foto/foto';


@Component({
  templateUrl: 'tabs.html'
})


export class TabsPage {

  tab0 = HomePage;
  tab1 = FotoPage;
  tab2 = AlbumPage;
  tab3 = MateriaPage;
  tab4 = ConfigPage;

  constructor() {

  }
}

