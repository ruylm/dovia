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

}