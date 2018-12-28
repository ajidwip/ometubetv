import { Component } from '@angular/core';
import { LoadingController, NavController, Platform, AlertController, ToastController, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpHeaders } from "@angular/common/http";
import { StatusBar } from '@ionic-native/status-bar';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppVersion } from '@ionic-native/app-version';

// declare var Swiper: any;
declare var window: any;
declare var adsbygoogle: any[];

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  myForm: FormGroup;
  public channellist = [];
  public channellive = [];
  public loader: any;
  public datetimecurrent: any;
  public nextno: any;
  public packagename: any;
  public appinfo = [];
  public listchannellive = [];
  public searchlive = [];
  public listchannelnotlive = [];
  public listchannelnotlivestream = [];
  public searchnotlive = [];
  public listchannellivedetail = [];
  public channelstream: any;
  public radiostream: any;
  public url: any;
  public id: any;
  public channels = [];
  public channelslive = [];
  public channellistall = [];
  public datashow: boolean = false;
  public ads: any;
  public list: boolean = true;
  public favorit = [];
  public mostwatch = [];
  public quality = [];
  public notlive = [];
  public livedetail = [];
  public qualityid: any;
  public width: any;
  public height: any;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public fb: FormBuilder,
    private statusBar: StatusBar,
    public toastCtrl: ToastController,
    private admob: AdMobPro,
    public appVersion: AppVersion,
    public app: App) {
    this.myForm = fb.group({
      comment: ['', Validators.compose([Validators.required])],
    })
    this.loader = this.loadingCtrl.create({
      // cssClass: 'transparent',
    });
    this.loader.present().then(() => {
    });
    this.width = window.screen.availWidth;
    this.height = window.screen.availHeight;
    this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
    this.doGetLive();
    this.doGetListChannel();
    this.doGetList();
    this.doGetMostWatched();
  }
  ionViewDidLoad() {
  }
  getNextNoDevices() {
    return this.api.get('nextno/z_devices/id')
  }
  doGetArsips() {

  }
  ionViewDidEnter() {
    this.mostwatch = [];
    this.doGetMostWatched();
  }
  ionViewWillLeave() {
  }
  ngAfterViewInit() {
    this.loader.dismiss()
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { }
  }
  doGetListChannel() {
    this.api.get("table/z_list_channel_web", { params: { filter: "status='OPEN'", limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellist = val['data']
      }, err => {
        this.doGetListChannel();
      });
  }
  doDetailMostWatched() {
    this.navCtrl.push('ChannelPage', {
      name: 'Most Watched',
      category: 'MOSTWATCHED',
      type: 'GRID',
      stream: ''
    })
  }
  doDetail(channel) {
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category,
      type: channel.type,
      stream: channel.stream
    })
  }
  doDetailLive(live) {
    this.navCtrl.push('ChannelPage', {
      name: live.category,
      category: live.type,
      stream: live.stream
    })
  }
  doPreviewArsip(channeldetail) {
    if (channeldetail.type == 'STREAM') {
      this.api.get("table/z_channel_stream", { params: { limit: 1, filter: "id=" + "'" + channeldetail.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel_stream",
            {
              "id": channeldetail.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    else if (channeldetail.type == 'TV') {
      this.api.get("table/z_channel", { params: { limit: 1, filter: "id=" + "'" + channeldetail.id + "'" } })
        .subscribe(val => {
          let data = val['data']
          const headers = new HttpHeaders()
            .set("Content-Type", "application/json");
          this.api.put("table/z_channel",
            {
              "id": channeldetail.id,
              "click": data[0].click + 1
            },
            { headers })
            .subscribe(val => {
            });
        });
    }
    this.navCtrl.push('PreviewPage', {
      id: channeldetail.id,
      name: channeldetail.name,
      title: channeldetail.title,
      category: channeldetail.category,
      trailer: channeldetail.trailer,
      type: channeldetail.type,
      stream: channeldetail.stream,
      xml: channeldetail.xml,
      plugin: channeldetail.plugin,
      url: channeldetail.url,
      controls: channeldetail.controls
    })
  }
  doGetMostWatched() {
    this.api.get("table/z_channel_stream", { params: { filter: "status='OPEN'", limit: 5, sort: "click" + " DESC " } })
      .subscribe(val => {
        let data = val['data']
        for (let i = 0; i < data.length; i++) {
          this.mostwatch.push(data[i]);
        }
      }, err => {
        this.doGetMostWatched();
      });
  }
  doGetList() {
    //this.api.get("table/z_list_channel_web", { params: { filter: "status='OPEN' AND (name LIKE 'TV%' OR category='STREAM')", limit: 100, sort: "name" + " ASC " } })
    this.api.get("table/z_list_channel_web", { params: { filter: "status='OPEN' AND type='GRID'", limit: 100, sort: "name" + " ASC " } })
      .subscribe(val => {
        this.channellistall = val['data']
        let data = val['data']
        for (let i = 0; i < data.length; i++) {
          if (data[i].category == 'TV') {
            this.api.get("table/z_channel", { params: { filter: "status='OPEN' AND status_2 !='CLSD' AND name=" + "'" + data[i].name + "'", limit: 5, sort: "click" + " DESC " } })
              .subscribe(val => {
                let data = val['data']
                for (let i = 0; i < data.length; i++) {
                  this.channels.push(data[i]);
                }
              });
          }
          else {
            this.api.get("table/z_channel_stream", { params: { filter: "status='OPEN' AND name=" + "'" + data[i].name + "'", limit: 5, sort: "date" + " DESC " } })
              .subscribe(val => {
                let data = val['data']
                for (let i = 0; i < data.length; i++) {
                  this.channels.push(data[i]);
                }
              });
          }
        }
        this.datashow = true;
      }, err => {
        this.doGetList();
      });
  }
  doGetLive() {
    this.api.get("table/z_channel_live", { params: { limit: 10, filter: "status='OPEN'" + " AND datefinish >=" + "'" + this.datetimecurrent + "'", sort: "datestart" + " ASC " } })
      .subscribe(val => {
        this.channellive = val['data']
      }, err => {
        this.doGetLive();
      });
  }
  doComment() {
    document.getElementById('header').style.display = 'none';
    document.getElementById('content').style.display = 'none';
    document.getElementById('comment').style.display = 'block';
  }
  doCloseComment() {
    document.getElementById('header').style.display = 'block';
    document.getElementById('content').style.display = 'block';
    document.getElementById('comment').style.display = 'none';
    this.myForm.reset();
  }
  doPostComment() {
    this.getNextNo().subscribe(val => {
      this.nextno = val['nextno'];
      const headers = new HttpHeaders()
        .set("Content-Type", "application/json");
      this.api.post("table/z_comment",
        {
          "id": this.nextno,
          "comment": this.myForm.value.comment,
          "datetime": moment().format('YYYY-MM-DD HH:mm:ss'),
        },
        { headers })
        .subscribe(val => {
          this.myForm.reset();
          let alert = this.alertCtrl.create({
            subTitle: 'Success',
            message: 'Terima kasih atas komen dan sarannya.',
            buttons: ['OK']
          });
          alert.present();
          this.doCloseComment();
        }, (err) => {
          let alert = this.alertCtrl.create({
            subTitle: 'Error',
            message: 'Submit error',
            buttons: ['OK']
          });
          alert.present();
        })
    });
  }
  getNextNo() {
    return this.api.get('nextno/z_comment/id')
  }
  getSearch(ev: any) {
    let value = ev.target.value;

    if (value && value.trim() != '') {
      this.api.get("table/z_channel", { params: { limit: 500, filter: "status = 'OPEN'" } })
        .subscribe(val => {
          this.listchannelnotlive = val['data']
          this.searchnotlive = this.listchannelnotlive
          this.listchannelnotlive = this.searchnotlive.filter(notlive => {
            return notlive.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        });
    } else {
      this.listchannelnotlive = [];
    }
    if (value && value.trim() != '') {
      this.api.get("table/z_channel_stream", { params: { limit: 500, filter: "status = 'OPEN'" } })
        .subscribe(val => {
          this.listchannelnotlivestream = val['data']
          this.searchnotlive = this.listchannelnotlivestream
          this.listchannelnotlivestream = this.searchnotlive.filter(notlive => {
            return notlive.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        });
    } else {
      this.listchannelnotlivestream = [];
    }
    if (value && value.trim() != '') {
      this.api.get("table/z_channel_live", { params: { limit: 500, filter: "status = 'OPEN'" } })
        .subscribe(val => {
          this.listchannellive = val['data']
          this.searchlive = this.listchannellive
          this.listchannellive = this.searchlive.filter(live => {
            return live.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
          })
        });
    } else {
      this.listchannellive = [];
    }
  }
  doGrid() {
    this.list = false;
    document.getElementById('list').style.display = 'none'
    document.getElementById('grid').style.display = 'block'
    document.getElementById('live').style.display = 'none'
    document.getElementById('ads').style.display = 'none'
  }
  doList() {
    this.list = true;
    document.getElementById('list').style.display = 'block'
    document.getElementById('grid').style.display = 'none'
    document.getElementById('live').style.display = 'block'
    document.getElementById('ads').style.display = 'block'
  }
  doSports() {
    this.navCtrl.push('SportslivePage', {
      param: '0'
    })
  }
  doQuality(channeldetail) {
    this.qualityid = ''
    if (channeldetail.type == 'STREAM') {
      this.navCtrl.push('PreviewPage', {
        id: channeldetail.id,
        name: channeldetail.name,
        title: channeldetail.title,
        category: channeldetail.category,
        trailer: channeldetail.trailer,
        type: channeldetail.type,
        stream: channeldetail.stream,
        xml: channeldetail.xml,
        plugin: channeldetail.plugin,
        url: channeldetail.url,
        controls: channeldetail.controls
      })
    }
    else if (channeldetail.type == 'TV') {
      this.api.get("table/z_channel_url", { params: { limit: 10, filter: "id_channel=" + "'" + channeldetail.id + "'" + "AND status = 'OPEN'", sort: 'quality ASC' } })
        .subscribe(val => {
          this.quality = val['data']
          document.getElementById('quality').style.display = 'block';
        });
    }
  }
  doQualityNotLive(notlive) {
    if (notlive.type == 'STREAM') {
      this.navCtrl.push('PreviewPage', {
        id: notlive.id,
        name: notlive.name,
        title: notlive.title,
        category: notlive.category,
        trailer: notlive.trailer,
        type: notlive.type,
        stream: notlive.stream,
        xml: notlive.xml,
        plugin: notlive.plugin,
        url: notlive.url,
        controls: notlive.controls
      })
    }
    else if (notlive.type == 'TV') {
      this.api.get("table/z_channel_url", { params: { limit: 10, filter: "id_channel=" + "'" + notlive.id + "'" + "AND status = 'OPEN'", sort: 'quality ASC' } })
        .subscribe(val => {
          this.quality = val['data']
          document.getElementById('quality').style.display = 'block';
        });
    }
  }
  doQualityLive(livedetail) {
    this.api.get("table/z_channel_live_url", { params: { limit: 10, filter: "id_channel=" + "'" + livedetail.id + "'" + "AND status = 'OPEN'", sort: 'quality ASC' } })
      .subscribe(val => {
        this.quality = val['data']
        document.getElementById('quality').style.display = 'block';
      });
  }
  doCloseQuality() {
    document.getElementById('quality').style.display = 'none';
  }
  doSelectQuality() {
  }
  doPlayerweb(channeldetail) {
    this.navCtrl.push('PlayerPage', {
      id: channeldetail.id,
      type: channeldetail.type,
      name: channeldetail.name,
      url: channeldetail.url,
      stream: channeldetail.stream,
      title: channeldetail.title,
      thumbnail_picture: channeldetail.thumbnail_picture,
      xml: channeldetail.xml,
      trailer: channeldetail.trailer,
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
  doPrivacy() {
    this.navCtrl.push('PrivacyPage')
  }
  doDisclaimer() {
    this.navCtrl.push('DisclaimerPage')
  }
  doContact() {
    this.navCtrl.push('ContactPage')
  }
  doHome() {
    this.app.getRootNav().setRoot(HomePage)
  }
}
