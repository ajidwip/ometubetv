import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Platform } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';

@IonicPage()
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
})
export class UpdatePage {
  public latestversion: any;
  public previousversion: any;
  public description = [];
  public url: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public app: App) {
    this.latestversion = this.navParams.get('latestversion')
    this.previousversion = this.navParams.get('previousversion')
    this.description = [this.navParams.get('description')]
    this.url = this.navParams.get('url')
  }

  ionViewDidLoad() {

  }
  doUpdate() {
    window.location.href = this.url
  }
  doHome() {
    this.app.getRootNav().setRoot(HomePage)
  }

}
