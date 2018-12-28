import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { HttpHeaders } from "@angular/common/http";
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppVersion } from '@ionic-native/app-version';
import { HomePage } from '../../pages/home/home';

declare var window: any;
declare var videojs: any;
declare var adsbygoogle: any[];

@IonicPage()
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {
  public channels = [];
  public channellist = [];
  public channeldetail = [];
  public channelcategory: any;
  public channeltype: any;
  public channelname: any;
  public channelstream: any;
  public loader: any;
  public url: any;
  public id: any;
  public radiostream: boolean;
  public datecurrent: any;
  public datetimecurrent: any;
  public search: any;
  public title: any;
  public showsearch: boolean = false;
  halaman = 0;
  public packagename: any;
  public ads: any;
  public uuiddevices: any;
  public quality = [];
  public qualityid: any;
  public listchannel = false;
  public text: any;
  public width: any;
  public height: any;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public appVersion: AppVersion,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private admob: AdMobPro,
    public app: App) {
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present().then(() => {
      this.width = window.screen.availWidth;
      this.height = window.screen.availHeight;
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.radiostream = false;
      this.channelcategory = this.navParam.get('category')
      this.channeltype = this.navParam.get('type')
      this.channelname = this.navParam.get('name')
      this.uuiddevices = this.navParam.get('uuiddevices')
      if (this.channelcategory == 'TV') {
        this.doGetChannel();
      }
      else if (this.channelcategory == 'STREAM') {
        this.doGetChannelStream();
      }
      else if (this.channelcategory == 'LIVE') {
        this.doGetChannelLive();
        this.api.get("table/z_channel_live", { params: { limit: 500, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channeldetail = val['data']
            this.loader.dismiss()
          });
      }
      else if (this.channelcategory == 'RADIO') {
        this.doGetChannelRadio();
      }
      else if (this.channelcategory == 'ARSIP') {
        this.doGetChannelArsip();
      }
      else if (this.channelcategory == 'MOSTWATCHED') {
        this.doGetChannelMostWatched();
      }
    });
  }
  ngAfterViewInit() {
    //this.loader.dismiss()
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { }
  }
  doShowSearch() {
    this.showsearch = this.showsearch ? false : true
  }
  doHideSearch() {
    this.showsearch = this.showsearch ? false : true
  }
  doGetChannel() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel", { params: { limit: 30, offset: offset, filter: "name=" + "'" + this.channelname + "' AND status='OPEN' AND status_2 != 'CLSD'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelStream() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_stream", { params: { limit: 30, offset: offset, filter: "name=" + "'" + this.channelname + "' AND status='OPEN'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelArsip() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_arsip_users", { params: { limit: 30, offset: offset, filter: "uuid_device=" + "'" + this.uuiddevices + "'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelMostWatched() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_stream", { params: { limit: 30, offset: offset, filter: "status='OPEN'", sort: "click" + " DESC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelLive() {
    return new Promise(resolve => {
      let offset = 100 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_live", { params: { limit: 100, offset: offset, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND date >=" + "'" + this.datecurrent + "'", group: "date", sort: "date" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelLiveDetail() {
    return new Promise(resolve => {
      let offset = 100 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_live", { params: { limit: 100, offset: offset, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channeldetail.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetChannelRadio() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_radio", { params: { limit: 30, offset: offset, filter: "status='OPEN'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            this.loader.dismiss();
            for (let i = 0; i < data.length; i++) {
              this.channels.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  ionViewDidLoad() {
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
  doInfinite(infiniteScroll) {
    if (this.channelcategory == 'TV') {
      this.doGetChannel().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'STREAM') {
      this.doGetChannelStream().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'LIVE') {
      this.doGetChannelLive().then(response => {
        this.api.get("table/z_channel_live", { params: { limit: 30, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channeldetail = val['data'];
          });
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'RADIO') {
      this.doGetChannelRadio().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'ARSIP') {
      this.doGetChannelArsip().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.channelcategory == 'MOSTWATCHED') {
      this.doGetChannelMostWatched().then(response => {
        infiniteScroll.complete();
      });
    }
  }
  doRefresh(refresher) {
    if (this.channelcategory == 'TV') {
      this.doGetChannel().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'STREAM') {
      this.doGetChannelStream().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'LIVE') {
      this.doGetChannelLive().then(response => {
        this.doGetChannelLiveDetail();
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'RADIO') {
      this.doGetChannelRadio().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'ARSIP') {
      this.doGetChannelArsip().then(response => {
        refresher.complete();
      });
    }
    else if (this.channelcategory == 'MOSTWATCHED') {
      this.doGetChannelMostWatched().then(response => {
        refresher.complete();
      });
    }
  }
  /*doPlayPlayer(channel) {
    if (channel.type == 'STREAM' && channel.name == 'Anime') {
      this.navCtrl.push('ChanneldetailPage', {
        anime: channel.title
      })
    }
    else if (channel.type == 'RADIO') {
      this.radiostream = this.radiostream ? false : true;
      this.url = channel.url
      this.id = channel.id
    }
    else {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(() => {
        this.title = channel.id
        let playerElement = document.getElementById(this.title)
        var video = videojs(playerElement);
        video.qualityPickerPlugin();
        video.play();
        document.getElementById(this.title).style.display = 'block';
        this.channelstream = channel.stream
        if (this.channelstream == '1') {
          this.platform.registerBackButtonAction(() => {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then(() => {
              let playerElement = document.getElementById(this.title);
              var video = videojs(playerElement);
              video.qualityPickerPlugin();
              video.pause();
              document.getElementById(this.title).style.display = 'none';
            });
          })
        }
      });
    }
  }*/
  getSearch(ev: any) {
    // set val to the value of the searchbar
    let value = ev;

    // if the value is an empty string don't filter the items
    if (value && value.trim() != '') {
      if (this.channelcategory == 'TV') {
        this.api.get("table/z_channel", { params: { limit: 10, filter: "name=" + "'" + this.channelname + "' AND title LIKE" + "'%" + value + "%' AND status='OPEN' AND status_2 != 'CLSD'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data']
            this.channels = data.filter(channel => {
              return channel.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            })
          });
      }
      else if (this.channelcategory == 'STREAM') {
        this.api.get("table/z_channel_stream", { params: { limit: 10, filter: "name=" + "'" + this.channelname + "' AND title LIKE" + "'%" + value + "%' AND status='OPEN'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data']
            this.channels = data.filter(channel => {
              return channel.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            })
          });
      }
      else if (this.channelcategory == 'LIVE') {
        this.api.get("table/z_channel_live", { params: { limit: 10, filter: "category=" + "'" + this.channelname + "' AND status='OPEN' AND title LIKE" + "'%" + value + "%'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            let data = val['data']
            this.channeldetail = data.filter(channel => {
              return channel.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            })
          });
      }
      else if (this.channelcategory == 'RADIO') {
        this.api.get("table/z_channel_radio", { params: { limit: 10, filter: "title LIKE" + "'%" + value + "%' AND status='OPEN'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data']
            this.channels = data.filter(channel => {
              return channel.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            })
          });
      }
      else if (this.channelcategory == 'ARSIP') {
        this.api.get("table/z_arsip_users", { params: { limit: 10, filter: "uuid_device=" + "'" + this.uuiddevices + "' AND title LIKE" + "'%" + value + "%'", sort: "title" + " ASC " } })
          .subscribe(val => {
            let data = val['data']
            this.channels = data.filter(channel => {
              return channel.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
            })
          });
      }
    }
    else {
      this.channels = [];
      this.halaman = 0;
      if (this.channelcategory == 'TV') {
        this.doGetChannel();
      }
      else if (this.channelcategory == 'STREAM') {
        this.doGetChannelStream();
      }
      else if (this.channelcategory == 'LIVE') {
        this.doGetChannelLive();
        this.api.get("table/z_channel_live", { params: { limit: 500, filter: "category=" + "'" + this.channelname + "' AND status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            this.channeldetail = val['data']
          });
      }
      else if (this.channelcategory == 'RADIO') {
        this.doGetChannelRadio();
      }
      else if (this.channelcategory == 'ARSIP') {
        this.doGetChannelArsip();
      }
      else if (this.channelcategory == 'MOSTWATCHED') {
        this.doGetChannelMostWatched();
      }
    }
  }
  doCloseQuality() {
    document.getElementById('qualitys').style.display = 'none';
  }
  doSelectQuality() {
  }
  doQuality(channel) {
    this.qualityid = ''
    if (channel.type == 'TV') {
      this.navCtrl.push('PlayerPage', {
        id: channel.id,
        type: channel.type,
        name: channel.name,
        url: channel.url,
        stream: channel.stream,
        title: channel.title,
        thumbnail_picture: channel.thumbnail_picture,
        xml: channel.xml,
      })
    }
    else if (channel.type == 'STREAM') {
      this.navCtrl.push('PreviewPage', {
        id: channel.id,
        name: channel.name,
        title: channel.title,
        category: channel.category,
        trailer: channel.trailer,
        type: channel.type,
        stream: channel.stream,
        xml: channel.xml,
        plugin: channel.plugin,
        url: channel.url,
        controls: channel.controls
      })
    }
    else if (channel.type == 'RADIO') {
      this.radiostream = this.radiostream ? false : true;
      this.url = channel.url
      this.id = channel.id
    }
  }
  doQualityLive(channeld) {
    this.qualityid = '';
    if (channeld.url != '') {
      this.navCtrl.push('PlayerPage', {
        id: channeld.id,
        type: channeld.type,
        url: channeld.url,
        stream: channeld.stream,
        title: channeld.title,
        xml: channeld.xml,
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
  doChannelList() {
    this.doGetListChannel()
    this.listchannel = true;
    this.channelname = 'All Channels'
  }
  doChannel() {
    this.listchannel = false;
    this.channelname = this.navParam.get('name')
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
    this.channelname = this.navParam.get('name')
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category,
      type: channel.type,
      stream: channel.stream
    })
  }
  doReset() {
    this.text = ''
    this.getSearch(this.text)
  }
  doPlayerweb(channel) {
    this.navCtrl.push('PlayerPage', {
      id: channel.id,
      type: channel.type,
      name: channel.name,
      url: channel.url,
      stream: channel.stream,
      title: channel.title,
      thumbnail_picture: channel.thumbnail_picture,
      xml: channel.xml,
      trailer: channel.trailer,
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
  doHome() {
    this.app.getRootNav().setRoot(HomePage)
  }

}
