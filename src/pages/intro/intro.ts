import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @ViewChild(Slides) slides: Slides;

  // slides = [
  //   {
  //     title: "Bem vindo ao ClasSnap!",
  //     description: "O <b>ClasSnap</b> é um app para ajuda-lo nos seus estudos.",
  //     image: "assets/imgs/fundo-intro.jpg",
  //   },
  //   {
  //     title: "Cadastro de Matérias",
  //     description: "Nesse menu é possível o cadastro de suas matérias e a grade de horarios, para que as fotos sejam armazenadas conforme foram cadastradas.",
  //     image: "assets/imgs/fundo-intro.jpg",
  //   },
  //   {
  //     title: "Foto",
  //     description: "A opção <b>Foto</b> é utilizada para tirar um foto do quadro com a matéria passada, para evitar de ter que escrever em seu caderno.",
  //     image: "assets/imgs/fundo-intro.jpg",
  //   },
  //   {
  //     title: "Album",
  //     description: "Na opção <b>Album</b> voce irá encontrar todas as suas fotos separadas por materias para poder estudar futuramente.",
  //     image: "assets/imgs/fundo-intro.jpg",
  //   }
  // ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    //alert('Current index is ' + currentIndex);
    if(currentIndex === 4) {
      this.navCtrl.push(HomePage)
    }
  }

  irParaTabs() {
    this.navCtrl.push(HomePage)
    // this.navCtrl.push(TabsPage).then(() => {
    //   const startIndex = this.navCtrl.getActive().index - 1;
    //   this.navCtrl.remove(startIndex, 1);
    // })
  }

}
