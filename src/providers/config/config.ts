import { Injectable } from '@angular/core';

@Injectable()
export class ConfigProvider {

    constructor() {
    }

    getConfig() {
        return localStorage.getItem("config")
    }

    setConfig(showSlide?: boolean) {
        let config = {
            showSlide: false
        }

        if (showSlide) {
            config.showSlide = showSlide
        }

        localStorage.setItem("config", JSON.stringify(config))
    }
}