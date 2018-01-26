import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IntroPage } from '../pages/intro/intro';
import { ConfigProvider } from '../providers/config/config';

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigProvider
  ]
})
export class MyApp {
  //rootPage:any = TabsPage;
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, configProvider: ConfigProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      let config = configProvider.getConfig();
      localStorage.getItem("config")

      if (config == null || config == undefined){
        this.rootPage = IntroPage;
        configProvider.setConfig(false);
      } else {
        //this.rootPage = HomePage;
        this.rootPage = IntroPage;
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
