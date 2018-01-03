import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalMateriaPage } from './modal-materia';

@NgModule({
  declarations: [
    ModalMateriaPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalMateriaPage),
  ],
})
export class ModalMateriaPageModule {}
