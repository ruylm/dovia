import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-album',
  templateUrl: 'album.html'
})
export class AlbumPage {

  public pastas = [];

  private pathNovo: string = this.file.dataDirectory;

  constructor(public navCtrl: NavController, public navParams: NavParams, private file: File) {

    var dataAtual = (new Date());
    var dataFoto = (new Date(1514807100000));
    var diaDaSemanaAtual = dataAtual.getDay();
    var diaAtual = dataAtual.getUTCDate();
    var mesAtual = dataAtual.getUTCMonth() + 1;
    var anoAtual = dataAtual.getUTCFullYear();
    alert("dataAtual: ano: " + anoAtual + " mes: " + mesAtual + " dia: " + diaAtual + " diaDaSemana: " + diaDaSemanaAtual)

    var diaDaSemanaFoto = dataFoto.getDay();
    var diaFoto = dataFoto.getUTCDate();
    var mesFoto = dataFoto.getUTCMonth() + 1;
    var anoFoto = dataFoto.getUTCFullYear();
    alert("dataFoto: ano: " + anoFoto + " mes: " + mesFoto + " dia: " + diaFoto + " diaDaSemana: " + diaDaSemanaFoto)

    if (anoAtual === anoFoto) {

      // Mesmo mes
      if (mesAtual === mesFoto) {

        let quantidadeDias: number = Number((diaAtual - diaFoto));

        if (quantidadeDias === 0) { alert("Hoje") }
        else if (quantidadeDias === 1) { alert("Ontem") }
        else if (quantidadeDias === 2) { alert("Há 2 dias atrás") }
        else if (quantidadeDias === 3) { alert("Há 3 dias atrás") }
        else if (quantidadeDias === 4) { alert("Há 4 dias atrás") }
        else if (quantidadeDias === 5) { alert("Há 5 dias atrás") }
        else if (quantidadeDias === 6) { alert("Há 6 dias atrás") }
        else if (quantidadeDias === 7) { alert("Há 7 dias atrás") }
        else if (quantidadeDias > 7 && quantidadeDias < 15) { alert("Há 1 semana atrás") }
        else if (quantidadeDias > 14 && quantidadeDias < 22) { alert("Há 2 semanas atrás") }
        else if (quantidadeDias > 21 && quantidadeDias < 28) { alert("Há 3 semanas atrás") }
        else if (quantidadeDias > 27 && quantidadeDias < 32) { alert("Há 4 semanas atratrásas") }
      }
      // Mes diferente
      else {

        let quantidadeMeses: number = Number((mesAtual - mesFoto));

        if (quantidadeMeses === 1) { alert("Há 1 mes atrás") }
        else if (quantidadeMeses === 2) { alert("Há 2 meses atrás") }
        else if (quantidadeMeses === 3) { alert("Há 3 meses atrás") }
        else if (quantidadeMeses === 4) { alert("Há 4 meses atrás") }
        else if (quantidadeMeses === 5) { alert("Há 5 meses atrás") }
        else if (quantidadeMeses === 6) { alert("Há 6 meses atrás") }
        else if (quantidadeMeses === 7) { alert("Há 7 meses atrás") }
        else if (quantidadeMeses === 8) { alert("Há 8 meses atrás") }
        else if (quantidadeMeses === 9) { alert("Há 9 meses atrás") }
        else if (quantidadeMeses === 10) { alert("Há 10 meses atrás") }
        else if (quantidadeMeses === 11) { alert("Há 11 meses atrás") }
        else if (quantidadeMeses === 12) { alert("Há 12 meses atrás") }

      }

    } else {

      let quantidadeAnos: number = Number((anoAtual - anoFoto));
      if (quantidadeAnos === 1) { alert("Ano passado") }
      else if (quantidadeAnos === 2) { alert("Há 2 anos atrás") }
      else { alert("Há mais de 2 anos") }
    }

  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    await this.listarMaterias();
  }

  abrirGaleria(materia: string) {
    this.navCtrl.push("AlbumGaleriaPage", { nome: materia });
  }

  async listarMaterias() {
    try {
      this.pastas = [];
      let retorno = await this.file.listDir(this.pathNovo, "csfotos")
      for (let dado of retorno) {
        if (dado.isDirectory === true) {
          this.pastas.push(dado.name);
        }
      }
    } catch (error) {
      alert("error : " + JSON.stringify(error))
    }
  }

}
