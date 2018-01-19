import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAnotacaoPage } from './modal-anotacao';

@NgModule({
  declarations: [
    ModalAnotacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAnotacaoPage),
  ],
})
export class ModalAnotacaoPageModule {}
