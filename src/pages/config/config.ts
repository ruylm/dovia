import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Tabs, ModalController, ActionSheetController } from 'ionic-angular';
import { DataBaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
  providers: [
    DataBaseProvider
  ]
})
export class ConfigPage {

  public dataTela;
  public anotacoesDoDia = [];
  public totalAnotacoesDoDia = 0;

  public diaSelecionado = {
    ano: 0,
    mes: 0,
    dia: 0,
  };
  public descricao = "";
  tab: Tabs;

  constructor(public navCtrl: NavController, public actionsheetCtrl: ActionSheetController, private modal: ModalController, private viewCtrl: ViewController, public navParams: NavParams, private dataBase: DataBaseProvider, public alertCtrl: AlertController) {
    this.tab = this.navCtrl.parent;
  }

  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

  // Esse metodo e executado sempre que a tela e exibida
  async ionViewWillEnter() {
    this.anotacoesDoDia = await this.dataBase.getAnotacoesOrdenadas(3, this.diaSelecionado);
  }

  async onDaySelect(evento) {
    //alert(JSON.stringify(evento))
    this.diaSelecionado.ano = evento.year;
    this.diaSelecionado.mes = evento.month;
    this.diaSelecionado.dia = evento.date;

    this.anotacoesDoDia = await this.dataBase.getAnotacoesOrdenadas(3, this.diaSelecionado);
    this.totalAnotacoesDoDia = this.anotacoesDoDia.length;
    if (evento.isToday) {
      this.dataTela = "Hoje, " + evento.date + " de " + this.verificaMes(evento.month);
    }
    else {
      this.dataTela = evento.date + " de " + this.verificaMes(evento.month);
    }
  }

  visualizarNotificacao(item) {
    let mensagem = item.split("-", 2)[1]
    let alerta = this.alertCtrl.create({
      title: item.split("-", 2)[0],
      subTitle: item.split("-", 2)[1],
      buttons: ['OK']
    });
    alerta.present();
  }

  async salvarAnotacao() {
    let dataSalvando = new Date();
    dataSalvando.setFullYear(this.diaSelecionado.ano);
    dataSalvando.setMonth(this.diaSelecionado.mes);
    dataSalvando.setDate(this.diaSelecionado.dia);

    let mensagemFormatada = "";
    let diaFormatado = "";
    let mesFormatado = "";

    if (this.diaSelecionado.mes === 0) { mesFormatado = "01" }
    else if (this.diaSelecionado.mes === 1) { mesFormatado = "02" }
    else if (this.diaSelecionado.mes === 2) { mesFormatado = "03" }
    else if (this.diaSelecionado.mes === 3) { mesFormatado = "04" }
    else if (this.diaSelecionado.mes === 4) { mesFormatado = "05" }
    else if (this.diaSelecionado.mes === 5) { mesFormatado = "06" }
    else if (this.diaSelecionado.mes === 6) { mesFormatado = "07" }
    else if (this.diaSelecionado.mes === 7) { mesFormatado = "08" }
    else if (this.diaSelecionado.mes === 8) { mesFormatado = "09" }
    else if (this.diaSelecionado.mes === 9) { mesFormatado = "10" }
    else if (this.diaSelecionado.mes === 10) { mesFormatado = "11" }
    else if (this.diaSelecionado.mes === 11) { mesFormatado = "12" }

    if (this.diaSelecionado.dia === 1) { diaFormatado = "01" }
    else if (this.diaSelecionado.dia === 2) { diaFormatado = "02" }
    else if (this.diaSelecionado.dia === 3) { diaFormatado = "03" }
    else if (this.diaSelecionado.dia === 4) { diaFormatado = "04" }
    else if (this.diaSelecionado.dia === 5) { diaFormatado = "05" }
    else if (this.diaSelecionado.dia === 6) { diaFormatado = "06" }
    else if (this.diaSelecionado.dia === 7) { diaFormatado = "07" }
    else if (this.diaSelecionado.dia === 8) { diaFormatado = "08" }
    else if (this.diaSelecionado.dia === 9) { diaFormatado = "09" }
    else { diaFormatado = this.diaSelecionado.dia.toString() }

    mensagemFormatada = this.diaSelecionado.ano + "-" + mesFormatado + "-" + diaFormatado + "__" + diaFormatado + "/" + mesFormatado + "/" + this.diaSelecionado.ano + " - " + this.descricao

    let gravar = {
      descricao: this.descricao,
      data: dataSalvando,
      ano: this.diaSelecionado.ano,
      mes: this.diaSelecionado.mes,
      dia: this.diaSelecionado.dia,
      msg: mensagemFormatada
    }

    let retorno = await this.dataBase.insereAnotacao(gravar);
    this.anotacoesDoDia = await this.dataBase.getAnotacoesOrdenadas(3, this.diaSelecionado);
    this.totalAnotacoesDoDia = this.anotacoesDoDia.length;
    this.descricao = "";
  }

  exibirAcoes(item) {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'O que deseja fazer',
      buttons: [
        {
          text: 'Apagar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            console.log('Delete clicked');
              this.removeAnotacao(this.anotacoesDoDia, item);
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


  abrirNovaAnotacao() {
    const modal = this.modal.create('ModalAnotacaoPage');

    modal.onWillDismiss((data) => {

      if (data === undefined) {

      } else {
        this.descricao = data;
        this.salvarAnotacao();
      }

    })

    modal.present();
  }

  async removeAnotacao(array, value) {
    try {
      // Removendo do banco de dados
      await this.dataBase.removeAnotacao(value);
      // Removendo da memoria
      await array.forEach(function (result, index) {
        if (result === value) {
          //Remove from array todasMaterias
          array.splice(index, 1);
        }
      });
      this.anotacoesDoDia = array;
    } catch (error) {
      alert("Erro: " + error)
    }
  }

  verificaMes(mesNumerico) {
    if (mesNumerico === 0) { return "Janeiro" }
    else if (mesNumerico === 1) { return "Fevereiro" }
    else if (mesNumerico === 2) { return "Março" }
    else if (mesNumerico === 3) { return "Abril" }
    else if (mesNumerico === 4) { return "Maio" }
    else if (mesNumerico === 5) { return "Junho" }
    else if (mesNumerico === 6) { return "Julho" }
    else if (mesNumerico === 7) { return "Agosto" }
    else if (mesNumerico === 8) { return "Setembro" }
    else if (mesNumerico === 9) { return "Outubro" }
    else if (mesNumerico === 10) { return "Novembro" }
    else if (mesNumerico === 11) { return "Dezembro" }
  }

}
