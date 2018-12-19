import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { HttpHeaders } from "@angular/common/http";
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppVersion } from '@ionic-native/app-version';

declare var window: any;
declare var adsbygoogle: any[];

@IonicPage()
@Component({
  selector: 'page-sportslive',
  templateUrl: 'sportslive.html',
})
export class SportslivePage {

  public channels = [];
  public datecurrent: any;
  public datetimecurrent: any;
  public channel: any;
  public url = [];
  public param: any;
  public loader: any;
  public name: any;
  public loading: any;
  public packagename: any;
  public ads: any;
  public listchannel = false;
  public channellist = [];
  public width: any;
  public height: any;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro,
    public appVersion: AppVersion) {
    this.loading = this.loadingCtrl.create({

    });
    this.loading.present().then(() => {
      this.width = window.screen.availWidth;
      this.height = window.screen.availHeight;
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.param = this.navParam.get('param')
      if (this.param == '0') {
        this.name = 'Live Today'
        this.api.get("table/z_channel_live", { params: { limit: 1000, filter: "date=" + "'" + this.datecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {

            };
            this.loading.dismiss()
          });
      }
      else {
        this.name = 'Live Now'
        this.api.get("table/z_channel_live", { params: { limit: 1000, filter: "datestart <=" + "'" + this.datetimecurrent + "'" + " AND " + "datefinish >" + "'" + this.datetimecurrent + "' AND status ='OPEN'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              for (let i = 0; i < data.length; i++) {

              };
            };
            this.loading.dismiss()
          });
      }
    });
  }
  goToPlay(channel) {
    if (channel.url != '') {
      this.navCtrl.push('PlayerPage', {
        id: channel.id,
        type: channel.type,
        url: channel.url,
        stream: channel.stream,
        title: channel.title,
        xml: channel.xml,
      })
      this.appVersion.getPackageName().then((name) => {
        this.packagename = name;
        this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
          .subscribe(val => {
            this.ads = val['data']
            var admobid = {
              banner: this.ads[0].ads_banner,
              interstitial: this.ads[0].ads_interstitial
            };
        
            this.admob.prepareInterstitial({
              adId: admobid.interstitial,
              isTesting: this.ads[0].testing,
              autoShow: true
            })
          });
      }, (err) => {
  
      })
    }
    else {
      let alert = this.alertCtrl.create({
        subTitle: 'Pertandingan belum dimulai',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  ngAfterViewInit() {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { }
  }
  ionViewDidEnter() {
    this.appVersion.getPackageName().then((name) => {
      this.packagename = name;
      this.api.get("table/z_admob", { params: { limit: 100, filter: "appid=" + "'" + this.packagename + "' AND status='OPEN'" } })
        .subscribe(val => {
          this.ads = val['data']
          var admobid = {
            banner: this.ads[0].ads_banner,
            interstitial: this.ads[0].ads_interstitial
          };

          this.admob.createBanner({
            adSize: 'SMART_BANNER',
            adId: admobid.banner,
            isTesting: this.ads[0].testing,
            autoShow: true,
            position: this.admob.AD_POSITION.BOTTOM_CENTER,
          });
        });
    }, (err) => {

    })
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }
  doChannelList() {
    this.doGetListChannel()
    this.listchannel = true;
  }
  doChannel() {
    this.listchannel = false;
  }
  doGetListChannel() {
    this.api.get("table/z_list_channel_web", { params: { filter: "status='OPEN'", limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellist = val['data']
      }, err => {
        this.doGetListChannel();
      });
  }
  doDetail(channel) {
    this.listchannel = false;
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category,
      type: channel.type,
      stream: channel.stream
    })
  }

}
