import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from '../pipes/safe/safe';
import { HomePage } from '../pages/home/home';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppVersion } from '@ionic-native/app-version';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    /*IonicModule.forRoot(MyApp, {
      locationStrategy: 'path'
    }),*/
    HttpClientModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ApiProvider,
    SplashScreen,
    ScreenOrientation,
    AndroidFullScreen,
    YoutubeVideoPlayer,
    AdMobPro,
    AppVersion
  ]
})
export class AppModule { }
