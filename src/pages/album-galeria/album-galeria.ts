import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@IonicPage()
@Component({
  selector: 'page-album-galeria',
  templateUrl: 'album-galeria.html',
  providers: [
    Camera,
    PhotoViewer
  ]
})
export class AlbumGaleriaPage {
  menu: string = "todas";

  public fotos = [];
  public fotosImportantes = [];
  pasta: string = "";
  private pathNovo: string = this.file.dataDirectory + "csfotos/";

  constructor(public navCtrl: NavController, private photoViewer: PhotoViewer, public actionsheetCtrl: ActionSheetController, public navParams: NavParams, private file: File, private viewCtrl: ViewController) {
  }

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    await this.buscarFotos()
  }

  // Esse metodo e executado sempre que o usuario deixa essa tela
  ionViewDidLeave() {
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
  }

  async buscarFotos() {
    this.fotos = [];
    this.fotosImportantes = [];

    try {
      this.pasta = this.navParams.get("nome");
      let retorno = await this.file.listDir(this.pathNovo, this.pasta)
      //alert(JSON.stringify(retorno))
      for (let dado of retorno) {
        if (dado.isFile === true) {

          // 0 = nome -- 1 = importante
          let splitted = dado.name.split("_", 2);
          let fotoImportante = (splitted[1].split(".", 1)).toString();

          let nomeSemImportant: number = Number((splitted[0].split(".", 1)));

          let nomeFt = dado.name;
          let nomeSemExtensao = nomeFt.split(".", 1)
          // alert("dados: " + JSON.stringify(dado.name))

          let date = new Date(nomeSemImportant);
          let dirFoto = dado.nativeURL.substr(0, dado.nativeURL.lastIndexOf('/') + 1);

          let imp: boolean = (fotoImportante === "1");

          let dat: string = date.toLocaleDateString();

          let per: string = this.verificaTempoDaFoto(nomeSemImportant);
          let dSemana: string = this.verificaDiaDaSemana(nomeSemImportant);

          let foto = {
            diretorioDaFoto: dirFoto,
            url: dado.nativeURL,
            importante: imp,
            data: dat,
            periodo: per,
            diaSemana: dSemana,
            nomeFoto: nomeFt,
            nomeFotoSemExtensao: nomeSemExtensao,
            nomeSemImportante: nomeSemImportant
          }

          this.fotos.push(foto);

          if (foto.importante) {
            this.fotosImportantes.push(foto);
          }

        }
      }
      //alert("Fim: " + this.fotos)
    } catch (error) {
      alert("error : " + JSON.stringify(error))
    }
  }

  abrirFoto(foto) {
    // file:///data/user/0/io.ionic.startr/files/csfotos/Extra/5151151.jpg
    this.photoViewer.show(foto.url);
  }

  // Funcao usada para quando o cliente "Press" na foto
  exibirAcoes(foto, menu) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'O que deseja fazer',
      buttons: [
        {
          text: 'Apagar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.removerFoto(foto);
          }
        },
        {
          text: menu,
          icon: 'create',
          handler: () => {
            this.marcarComoImportante(foto, menu);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel', // will always sort to be on the bottom
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  async marcarComoImportante(foto, opcao) {

    let nomeNovo: string = "";
    try {
      if (opcao === "Importante") {
        if (foto.importante === true) {
          return;
        }
        nomeNovo = foto.nomeSemImportante + "_1.jpg";
      } else {
        nomeNovo = foto.nomeSemImportante + "_0.jpg";
      }
      let pasta = (this.pathNovo + this.pasta + "/");
      await this.file.moveFile(pasta, foto.nomeFoto, pasta, nomeNovo);

      await this.buscarFotos();
    } catch (error) {
      alert("Erro: " + JSON.stringify(error))
    }

  }

  async removerFoto(foto) {

    try {
      let pasta = (this.pathNovo + this.pasta + "/");
      // Remove fisicamente do diretorio
      await this.file.removeFile(pasta, foto.nomeFoto);
      await this.buscarFotos();
    } catch (error) {
      alert("Erro: " + JSON.stringify(error))
    }

  }

  verificaDiaDaSemana(dtFoto) {
    let dataFoto = (new Date(dtFoto));
    let diaNumerico = dataFoto.getDay();
    if (diaNumerico === 0){return "Domingo"}
    else if (diaNumerico === 1){return "Segunda-Feira"}
    else if (diaNumerico === 2){return "Terça-Feira"}
    else if (diaNumerico === 3){return "Quarta-Feira"}
    else if (diaNumerico === 4){return "Quinta-Feira"}
    else if (diaNumerico === 5){return "Sexta-Feira"}
    else if (diaNumerico === 6){return "Sábado"}
  }

  verificaTempoDaFoto(dtFoto) {

    var dataAtual = new Date();
    var dataFoto = (new Date(dtFoto));
    var diaAtual = dataAtual.getDate();
    var mesAtual = dataAtual.getMonth() + 1;
    var anoAtual = dataAtual.getFullYear();
    //alert("dataAtual: ano: " + anoAtual + " mes: " + mesAtual + " dia: " + diaAtual + " diaDaSemana: " + diaDaSemanaAtual)

    var diaFoto = dataFoto.getDate();
    var mesFoto = dataFoto.getMonth() + 1;
    var anoFoto = dataFoto.getFullYear();
    //alert("dataFoto: ano: " + anoFoto + " mes: " + mesFoto + " dia: " + diaFoto + " diaDaSemana: " + diaDaSemanaFoto)

    if (anoAtual === anoFoto) {

      // Mesmo mes
      if (mesAtual === mesFoto) {

        let quantidadeDias: number = Number((diaAtual - diaFoto));

        if (quantidadeDias === 0) { return ("Hoje") }
        else if (quantidadeDias === 1) { return ("Ontem") }
        else if (quantidadeDias === 2) { return ("Há 2 dias") }
        else if (quantidadeDias === 3) { return ("Há 3 dias") }
        else if (quantidadeDias === 4) { return ("Há 4 dias") }
        else if (quantidadeDias === 5) { return ("Há 5 dias") }
        else if (quantidadeDias === 6) { return ("Há 6 dias") }
        else if (quantidadeDias === 7) { return ("Há 7 dias") }
        else if (quantidadeDias > 7 && quantidadeDias < 15) { return ("Há 1 semana") }
        else if (quantidadeDias > 14 && quantidadeDias < 22) { return ("Há 2 semanas") }
        else if (quantidadeDias > 21 && quantidadeDias < 28) { return ("Há 3 semanas") }
        else if (quantidadeDias > 27 && quantidadeDias < 32) { return ("Há 4 semanas") }
      }
      // Mes diferente
      else {

        let quantidadeMeses: number = Number((mesAtual - mesFoto));

        if (quantidadeMeses === 1) { return ("Há 1 mes") }
        else if (quantidadeMeses === 2) { return ("Há 2 meses") }
        else if (quantidadeMeses === 3) { return ("Há 3 meses") }
        else if (quantidadeMeses === 4) { return ("Há 4 meses") }
        else if (quantidadeMeses === 5) { return ("Há 5 meses") }
        else if (quantidadeMeses === 6) { return ("Há 6 meses") }
        else if (quantidadeMeses === 7) { return ("Há 7 meses") }
        else if (quantidadeMeses === 8) { return ("Há 8 meses") }
        else if (quantidadeMeses === 9) { return ("Há 9 meses") }
        else if (quantidadeMeses === 10) { return ("Há 10 meses") }
        else if (quantidadeMeses === 11) { return ("Há 11 meses") }
        else if (quantidadeMeses === 12) { return ("Há 12 meses") }

      }

    } else {

      let quantidadeAnos: number = Number((anoAtual - anoFoto));
      if (quantidadeAnos === 1) { return ("Ano passado") }
      else if (quantidadeAnos === 2) { return ("Há 2 anos") }
      else if (quantidadeAnos === 2) { return ("Há 3 anos") }
      else if (quantidadeAnos === 2) { return ("Há 4 anos") }
      else if (quantidadeAnos === 2) { return ("Há 5 anos") }
      else { return ("Há mais de 5 anos") }
    }

  }


}
