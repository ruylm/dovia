import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AlbumPage } from '../pages/album/album';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MateriaPage } from '../pages/materia/materia';
import { ConfigPage } from '../pages/config/config';
import { FotoPage } from '../pages/foto/foto';
import { IntroPage } from '../pages/intro/intro';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { CalendarModule } from 'ionic3-calendar-en';

//import { NgCalendarModule } from 'ionic2-calendar';
//import { AddEventPage } from '../pages/add-event/add-event';

@NgModule({
  declarations: [
    MyApp,
    AlbumPage,
    HomePage,
    MateriaPage,
    ConfigPage,
    FotoPage,
    IntroPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    CalendarModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AlbumPage,
    HomePage,
    MateriaPage,
    ConfigPage,
    FotoPage,
    IntroPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Camera,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
