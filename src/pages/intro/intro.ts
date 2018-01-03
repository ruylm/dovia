import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  slides = [
    {
      title: "Bem vindo ao ClasShot!",
      description: "O <b>ClasShot</b> é um app para ajuda-lo nos seus estudos.",
      image: "assets/imgs/intro01.png",
    },
    {
      title: "Cadastro de Matérias",
      description: "Nesse menu é possível o cadastro de suas matérias e a grade de horarios, para que as fotos sejam armazenadas conforme foram cadastradas.",
      image: "assets/imgs/intro02.png",
    },
    {
      title: "Foto",
      description: "A opção <b>Foto</b> é utilizada para tirar um foto do quadro com a matéria passada, para evitar de ter que escrever em seu caderno.",
      image: "assets/imgs/intro03.png",
    },
    {
      title: "Album",
      description: "Na opção <b>Album</b> voce irá encontrar todas as suas fotos separadas por materias para poder estudar futuramente.",
      image: "assets/imgs/intro04.png",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
  irParaTabs() {
    this.navCtrl.push(TabsPage)
  }

}
