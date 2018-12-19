import { ViewChild, Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Events, MenuController, Platform, Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpHeaders } from "@angular/common/http";
import { ApiProvider } from '../providers/api/api';
import { HomePage } from '../pages/home/home';
import moment from 'moment';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('mycontent') Nav: NavController;
  rootPage: any = HomePage;
  public loader: any;
  statusapp = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public versionNumber: any;
  public packagename: any;
  public appinfo = [];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public menuCtrl: MenuController,
    public events: Events,
    public app: App,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    public appVersion: AppVersion,
    public alertCtrl: AlertController,
    public splashScreen: SplashScreen) {
    this.loader = this.loadingCtrl.create({

    });
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
      this.statusBar.styleDefault();
      this.appVersion.getVersionNumber().then((version) => {
        this.versionNumber = version;
        this.appVersion.getPackageName().then((name) => {
          this.packagename = name;
          this.api.get("table/z_version", { params: { filter: "name=" + "'" + this.packagename + "'" } })
            .subscribe(val => {
              this.appinfo = val['data']
              if (this.appinfo.length) {
                if (this.appinfo[0].version > this.versionNumber) {
                  this.app.getRootNav().setRoot('UpdatePage', {
                    latestversion: this.appinfo[0].version,
                    previousversion: this.versionNumber,
                    description: this.appinfo[0].description,
                    url: this.appinfo[0].url
                  })
                }
                else {
                  this.api.get("table/z_status_app", { params: { filter: "status=" + 1, limit: 500 } })
                    .subscribe(val => {
                      this.statusapp = val['data']
                      if (this.statusapp.length) {
                        this.app.getRootNav().setRoot('InformationPage', {
                          type: this.statusapp[0].type,
                          description: this.statusapp[0].description,
                          url: this.appinfo[0].url
                        })
                      }
                    });
                }
              }
            });
        })
      }, (err) => {

      })
    });
  }
}

