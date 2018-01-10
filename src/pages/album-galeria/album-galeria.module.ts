import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlbumGaleriaPage } from './album-galeria';

@NgModule({
  declarations: [
    AlbumGaleriaPage,
  ],
  imports: [
    IonicPageModule.forChild(AlbumGaleriaPage),
  ],
})
export class AlbumGaleriaPageModule {}
