import { Injectable } from '@angular/core';

@Injectable()
export class DataBaseProvider {

    constructor() {
    }

    getMaterias() {
        let retorno = localStorage.getItem("materias")

        if (retorno === null) {
            return {};
        }
        return JSON.parse(retorno);
    }

    setMaterias(materias: object) {
        localStorage.setItem("materias", JSON.stringify(materias))
    }

    removeMateria(property, value) {

        try {
            let todasMaterias = this.getMaterias();

            todasMaterias.materias.forEach(function (result, index) {
                if (result[property] === value) {
                    //Remove from array todasMaterias
                    todasMaterias.materias.splice(index, 1);
                }
            });

            this.setMaterias(todasMaterias);
        } catch (error) {
            alert("Erro: " + error)
        }
    }

    removeHorario(property, value) {

        try {
            let todasMaterias = this.getMaterias();

            todasMaterias.materias.forEach(function (result, index) {
                if (result[property] === value) {
                    //Remove from array todasMaterias
                    todasMaterias.materias.splice(index, 1);
                }
            });

            this.setMaterias(todasMaterias);
        } catch (error) {
            alert("Erro: " + error)
        }
    }

    // Database referente a anotacoes
    async insereAnotacao(anotacao: object) {
        try {
            // alert("Inserindo anotacao: " + JSON.stringify(anotacao))
            let todasAnotacoes = await this.getAnotacoes();
            todasAnotacoes.itens.push(anotacao)
            // alert("Anotacoes cadastradas no BD: " + JSON.stringify(todasAnotacoes))
            localStorage.setItem("anotacoes", JSON.stringify(todasAnotacoes))
        } catch (error) {
            alert("Erro anotacao: " + error)
        }
    }
    async removeAnotacao(value) {
        try {
            let todasAnotacoes = await this.getAnotacoes();

            todasAnotacoes.itens.forEach(function (result, index) {
                if (result["msg"].indexOf(value) !== -1) {
                    //Remove from array todasMaterias
                    todasAnotacoes.itens.splice(index, 1);
                }
            });
            // alert("Anotacoes cadastradas no BD: " + JSON.stringify(todasAnotacoes))
            localStorage.setItem("anotacoes", JSON.stringify(todasAnotacoes))
        } catch (error) {
            alert("Erro anotacao: " + error)
        }
    }


    async getAnotacoes() {
        let retorno = await localStorage.getItem("anotacoes")

        if (retorno === null) {
            return {
                itens: []
            };
        }
        //alert("Retornando anotacoes: " + retorno)
        return JSON.parse(retorno);
    }

    // 1 - somenteSemVencer
    // 2 - Todas
    // 3 - Apenas do dia
    async getAnotacoesOrdenadas(somenteSemVencer, diaEscolhido?) {
        let retorno = await localStorage.getItem("anotacoes")

        if (retorno === null) {
            return [];
        }

        let ret = JSON.parse(retorno);

        let novoRetorno = [];
        let novoRetorno2 = [];
        let retornoTodas = [];
        let retornoDia = [];
        let dataHoje = new Date();
        dataHoje.setHours(0, 0, 0, 0);

        for (let anot of ret.itens) {
            if (somenteSemVencer === 1) {
                let dataAnotacao = new Date();
                dataAnotacao.setFullYear(anot.ano)
                dataAnotacao.setMonth(anot.mes)
                dataAnotacao.setDate(anot.dia)
                dataAnotacao.setHours(0, 0, 0, 0)
                //alert("dataAnotacao "+dataAnotacao +"   --   "+"dataHoje " + dataHoje)
                if (dataAnotacao.getTime() === dataHoje.getTime()) {
                    novoRetorno.push(anot.msg + "_diahoje_true")
                }
                else if (dataAnotacao > dataHoje) {
                    novoRetorno.push(anot.msg + "_diahoje_false")
                }
            }
            else if (somenteSemVencer === 2) {
                novoRetorno.push(anot.msg)
            }
            else if (somenteSemVencer === 3) {
                let dataAnotacao = new Date();
                dataAnotacao.setFullYear(anot.ano)
                dataAnotacao.setMonth(anot.mes)
                dataAnotacao.setDate(anot.dia)
                dataAnotacao.setHours(0, 0, 0, 0)
                dataHoje.setFullYear(diaEscolhido.ano)
                dataHoje.setMonth(diaEscolhido.mes)
                dataHoje.setDate(diaEscolhido.dia)
                dataHoje.setHours(0, 0, 0, 0)
                //alert("dataAnotacao "+dataAnotacao +"   --   "+"dataHoje " + dataHoje)
                if (dataAnotacao.getTime() === dataHoje.getTime()) {
                    novoRetorno.push(anot.msg + "_diahoje_true")
                }
            }
        }

        novoRetorno.sort();

        for (let a of novoRetorno) {
            let aux1 = a.split("__", 2)[1];
            let aux2 = aux1.split("_diahoje_", 2);
            let ret = {
                hoje: aux2[1],
                msg: aux2[0]
            }
            //alert(JSON.stringify(ret))
            novoRetorno2.push(ret)
            retornoTodas.push(aux2[0])
            retornoDia.push(aux2[0])
        }

        // alert("Retornando anotacoes: " + novoRetorno2)
        if (somenteSemVencer === 1) {
            return novoRetorno2;
        } else if (somenteSemVencer === 2) {
            return retornoTodas;
        } else {
            return retornoDia;
        }
    }

    // Database referente a tipo de foto
    async setTipoFoto(tipo) {
        // 1 --> Foto normal e 2 --> Foto extra
        await localStorage.setItem("tipoFoto", JSON.stringify(tipo))
    }
    async getTipoFoto() {
        // 1 --> Foto normal e 2 --> Foto extra
        let ret = await localStorage.getItem("anotacoes");
        return ret;
    }
}