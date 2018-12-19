import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, App } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-information',
  templateUrl: 'information.html',
})
export class InformationPage {
  public type: any;
  public description = [];
  public url: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public app: App) {
    this.type = this.navParams.get('type')
    this.url = this.navParams.get('url')
    this.description = [this.navParams.get('description')]
  }

  ionViewDidLoad() {
  }
  doCloseApp() {
    this.platform.exitApp();
  }
  doRating() {
    window.location.href = this.url
  }
  doHome() {
    this.app.getRootNav().setRoot(HomePage)
  }

}
