import { Component } from '@angular/core';
import { ToastController, IonicPage, LoadingController, NavController, Platform, AlertController, NavParams, App } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import moment from 'moment';
import { HttpHeaders } from "@angular/common/http";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player';
import { AdMobPro } from '@ionic-native/admob-pro';
import { AppVersion } from '@ionic-native/app-version';
import { HomePage } from '../../pages/home/home';

declare var Clappr: any;
declare var LevelSelector: any;
declare var videojs: any;
declare var jwplayer: any;
declare var window: any;
declare var adsbygoogle: any[];

@IonicPage()
@Component({
  selector: 'page-Player',
  templateUrl: 'Player.html',
})
export class PlayerPage {
  public listchannel = false;
  public channellist = [];
  public channelname: any;
  public id: any;
  public type: any;
  public name: any;
  public nameanime: any;
  public stream: any;
  public url: any;
  public urlembed: any;
  public trailer: any;
  public episode: any;
  public xml: any;
  public channels = [];
  public loading: any;
  public video: any;
  public width: any;
  public height: any;
  public title: any;
  public thumbnail_picture: any;
  public thumbnail: any;
  public quality: any;
  public channelall = [];
  public widthscreen: any;
  public heightscreen: any;
  public datecurrent: any;
  public datetimecurrent: any;
  public packagename: any;
  public ads: any;
  halaman = 0;

  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    public alertCtrl: AlertController,
    public platform: Platform,
    public navParam: NavParams,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public screenOrientation: ScreenOrientation,
    public androidFullScreen: AndroidFullScreen,
    public youtube: YoutubeVideoPlayer,
    private admob: AdMobPro,
    public appVersion: AppVersion,
    public app: App) {
    this.widthscreen = window.screen.availWidth;
    this.heightscreen = window.screen.availHeight;
    this.loading = this.loadingCtrl.create({
      // cssClass: 'transparent',

    });
    this.loading.present().then(() => {
      this.datecurrent = moment().format('YYYY-MM-DD');
      this.datetimecurrent = moment().format('YYYY-MM-DD HH:mm');
      this.id = this.navParam.get('id')
      this.type = this.navParam.get('type')
      this.name = this.navParam.get('name')
      this.stream = this.navParam.get('stream')
      this.url = this.navParam.get('url')
      this.title = this.navParam.get('title')
      this.trailer = this.navParam.get('trailer')
      this.thumbnail_picture = this.navParam.get('thumbnail_picture')
      this.width = platform.width();
      this.height = platform.height();
      var self = this;
      if (this.type == 'TV') {
        this.doGetTV()
      }
      else if (this.type == 'STREAM') {
        if (this.name == 'Anime' || this.name == 'Film Series') {
          this.doGetStreamDetail()
        }
        else {
          this.doGetStream()
        }
      }
      else if (this.type == 'LIVE') {
        this.doGetLive()
      }
      if (this.type == 'TV') {
        if (this.stream != '') {
          document.getElementById('embed').style.display = 'none'
          jwplayer('myElement').setup({
            playlist: [{
              file: this.url,
              title: this.title,
              mediaid: '1'
            }],
            width: "100%",
            aspectratio: "16:9",
            stretching: "uniform",
            autostart: true,
            androidhls: true,
            displaydescription: true,
            displaytitle: true,
            visualplaylist: false,
            skin: { "active": "#DF2148", "inactive": "#CCCCCC", "name": "glow" },
            plugins: {
              "https://www.metube.id/cc-content/themes/default/js/ping.js": { "pixel": "//content.jwplatform.com/ping.gif" }
            }
          });
          jwplayer('myElement').on('play', function () {
          });
          jwplayer('myElement').on('adError', function (error) {
          });
          jwplayer('myElement').on('fullscreen', function (e) {
            if (e.fullscreen == true) {
              self.admob.removeBanner();
              self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.LANDSCAPE);
              self.androidFullScreen.isImmersiveModeSupported()
                .then(() => self.androidFullScreen.immersiveMode())
                .catch(err => console.log(err));
            }
            else {
              var admobid = {
                banner: self.ads[0].ads_banner,
                interstitial: self.ads[0].ads_interstitial
              };

              self.admob.createBanner({
                adSize: 'SMART_BANNER',
                adId: admobid.banner,
                isTesting: self.ads[0].testing,
                autoShow: true,
                position: self.admob.AD_POSITION.BOTTOM_CENTER,
              });
              self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.PORTRAIT);
              self.androidFullScreen.isImmersiveModeSupported()
                .then(() => self.androidFullScreen.showSystemUI())
                .catch(err => console.log(err));
            }
          })
          jwplayer('myElement').on('error', function (error) {
            if (self.url.match(/210.210.155.35/)) {
              if (error.message == 'Cannot load M3U8: Crossdomain access denied') {
                let alert = self.alertCtrl.create({
                  title: 'CORS Error',
                  message: 'File tidak berhasil diputar karena kendala ISP yang memblock file streaming, untuk mengatasi harap download VPN Turbo dan setelah terinstall harap Aktifkan lalu pilih server BELANDA',
                  buttons: [
                    {

                      text: 'Install Chrome',
                      handler: () => {
                        window.open("https://chrome.google.com/webstore/detail/browsec-vpn-free-and-unli/omghfjlpggmjjaagoclmmobgdodcjboh");
                      }
                    },
                    {

                      text: 'Install Firefox',
                      handler: () => {
                        window.open("https://addons.mozilla.org/id/firefox/addon/browsec/");
                      }
                    },
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                      }
                    }
                  ]
                });
                alert.present();
              }
            }
            else {

              if (error.message == 'Cannot load M3U8: Crossdomain access denied') {
                let alert = self.alertCtrl.create({
                  title: 'CORS Error',
                  message: 'File tidak berhasil diputar karena kendala CORS, untuk mengatasi harap download plugin CORS dan setelah terinstall harap Aktifkan plugin CORS nya',
                  buttons: [
                    {

                      text: 'Install Chrome',
                      handler: () => {
                        window.open("https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi");
                      }
                    },
                    {

                      text: 'Install Firefox',
                      handler: () => {
                        window.open("https://addons.mozilla.org/id/firefox/addon/cors-everywhere/");
                      }
                    },
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                      }
                    }
                  ]
                });
                alert.present();
              }
            }
          });
        }
        else {
          this.urlembed = this.navParam.get('url')
          this.thumbnail = this.navParam.get('thumbnail_picture')
          document.getElementById('embed').style.display = 'block'
        }
        this.api.get("table/z_channel_url", { params: { filter: "status='OPEN' AND id_channel='" + this.id + "'", limit: 1000, sort: "id" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            this.stream = this.channels[0].stream
            this.url = this.channels[0].url
            this.title = this.channels[0].title
            this.quality = this.channels[0].quality
          });
      }
      else if (this.type == 'LIVE') {
        if (this.stream != '') {
          document.getElementById('embed').style.display = 'none'
          jwplayer('myElement').setup({
            playlist: [{
              file: this.url,
              title: this.title,
              mediaid: '1'
            }],
            width: "100%",
            aspectratio: "16:9",
            stretching: "uniform",
            autostart: true,
            androidhls: true,
            displaydescription: true,
            displaytitle: true,
            visualplaylist: false,
            skin: { "active": "#DF2148", "inactive": "#CCCCCC", "name": "glow" },
            plugins: {
              "https://www.metube.id/cc-content/themes/default/js/ping.js": { "pixel": "//content.jwplatform.com/ping.gif" }
            }
          });
          jwplayer('myElement').on('play', function () {
          });
          jwplayer('myElement').on('adError', function (error) {
          });
          jwplayer('myElement').on('fullscreen', function (e) {
            if (e.fullscreen == true) {
              self.admob.removeBanner()
              self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.LANDSCAPE);
              self.androidFullScreen.isImmersiveModeSupported()
                .then(() => self.androidFullScreen.immersiveMode())
                .catch(err => console.log(err));
            }
            else {
              var admobid = {
                banner: self.ads[0].ads_banner,
                interstitial: self.ads[0].ads_interstitial
              };

              self.admob.createBanner({
                adSize: 'SMART_BANNER',
                adId: admobid.banner,
                isTesting: self.ads[0].testing,
                autoShow: true,
                position: self.admob.AD_POSITION.BOTTOM_CENTER,
              });
              self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.PORTRAIT);
              self.androidFullScreen.isImmersiveModeSupported()
                .then(() => self.androidFullScreen.showSystemUI())
                .catch(err => console.log(err));
            }
          })
          jwplayer('myElement').on('error', function (error) {
            if (self.url.match(/210.210.155.35/)) {
              let alert = self.alertCtrl.create({
                title: 'CORS Error',
                message: 'File tidak berhasil diputar karena kendala ISP yang memblock file streaming, untuk mengatasi harap download plugin BROWSEC dan setelah terinstall harap Aktifkan plugin BROWSEC nya lalu pilih server BELANDA',
                buttons: [
                  {

                    text: 'Install',
                    handler: () => {
                      window.open("https://play.google.com/store/apps/details?id=free.vpn.unblock.proxy.turbovpn");
                    }
                  },
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                  }
                ]
              });
              alert.present();
            }
            else {
              let toast = self.toastCtrl.create({
                message: 'Server error harap pilih server lain !!!',
                duration: 3000
              });
              toast.present();
            }
          });
        }
        else {
          this.urlembed = this.navParam.get('url')
          this.thumbnail = this.navParam.get('thumbnail_picture')
          document.getElementById('embed').style.display = 'block'
        }
        this.api.get("table/z_channel_live_url", { params: { filter: "status='OPEN' AND id_channel='" + this.id + "'", limit: 1000, sort: "id" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            this.stream = this.channels[0].stream
            this.url = this.channels[0].url
            this.title = this.channels[0].title
            this.quality = this.channels[0].quality
          });
      }
      else if (this.type == 'STREAM') {
        let url = this.navParam.get('trailer')
        let urlembed = url.substring(32, 50)
        this.thumbnail = urlembed
        this.urlembed = urlembed
        this.quality = 'Trailer'
        document.getElementById('embed').style.display = 'block'
        if (this.name == 'Anime' || this.name == 'Film Series') {
          this.api.get("table/z_channel_stream_detail", { params: { filter: "status='OPEN' AND name='" + this.title + "'", limit: 1, sort: "episode" + " DESC " } })
            .subscribe(val => {
              let channels = val['data']
              this.api.get("table/z_channel_stream_detail_url", { params: { filter: "status='OPEN' AND name='" + this.title + "' AND episode='" + channels[0].episode + "'", limit: 1000, sort: "quality" + " ASC " } })
                .subscribe(val => {
                  this.channels = val['data']
                  this.stream = this.channels[0].stream
                  this.url = this.channels[0].url
                  this.title = this.channels[0].name
                  this.quality = 'Trailer'
                  this.episode = this.channels[0].episode
                  this.nameanime = this.channels[0].name
                });
            });
        }
        else {
          this.api.get("table/z_channel_stream_url", { params: { filter: "status='OPEN' AND id_channel='" + this.id + "'", limit: 1000, sort: "id" + " ASC " } })
            .subscribe(val => {
              this.channels = val['data']
              this.stream = this.channels[0].stream
              this.url = this.channels[0].url
              this.title = this.channels[0].title
              this.quality = 'Trailer'
            });
        }
      }
    });
  }
  ngAfterViewInit() {
    this.loading.dismiss();
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) { }
  }
  doChannelList() {
    this.doGetListChannel()
    this.listchannel = true;
    this.title = 'All Channels'
    this.quality = ''
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
  doUpdateLink(channel) {
    var self = this;
    this.urlembed = ''
    this.stream = channel.stream
    this.url = channel.url
    this.title = channel.title
    this.quality = channel.quality
    this.episode = channel.episode
    this.nameanime = channel.name
    if (channel.stream != '') {
      document.getElementById('embed').style.display = 'none'
      jwplayer('myElement').setup({
        playlist: [{
          file: channel.url,
          title: channel.title,
          mediaid: '1'
        }],
        width: "100%",
        aspectratio: "16:9",
        stretching: "uniform",
        autostart: true,
        androidhls: true,
        displaydescription: true,
        displaytitle: true,
        visualplaylist: false,
        skin: { "active": "#DF2148", "inactive": "#CCCCCC", "name": "glow" },
        plugins: {
          "https://www.metube.id/cc-content/themes/default/js/ping.js": { "pixel": "//content.jwplatform.com/ping.gif" }
        }
      });
      jwplayer('myElement').on('play', function () {
      });
      jwplayer('myElement').on('adError', function (error) {
      });
      jwplayer('myElement').on('fullscreen', function (e) {
        if (e.fullscreen == true) {
          self.admob.removeBanner()
          self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.LANDSCAPE);
          self.androidFullScreen.isImmersiveModeSupported()
            .then(() => self.androidFullScreen.immersiveMode())
            .catch(err => console.log(err));
        }
        else {
          var admobid = {
            banner: self.ads[0].ads_banner,
            interstitial: self.ads[0].ads_interstitial
          };

          self.admob.createBanner({
            adSize: 'SMART_BANNER',
            adId: admobid.banner,
            isTesting: self.ads[0].testing,
            autoShow: true,
            position: self.admob.AD_POSITION.BOTTOM_CENTER,
          });
          self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.PORTRAIT);
          self.androidFullScreen.isImmersiveModeSupported()
            .then(() => self.androidFullScreen.showSystemUI())
            .catch(err => console.log(err));
        }
      })
      jwplayer('myElement').on('error', function (error) {
        if (channel.url.match(/210.210.155.35/)) {
          if (error.message == 'Cannot load M3U8: Crossdomain access denied') {
            let alert = self.alertCtrl.create({
              title: 'CORS Error',
              message: 'File tidak berhasil diputar karena kendala ISP yang memblock file streaming, untuk mengatasi harap download plugin BROWSEC dan setelah terinstall harap Aktifkan plugin BROWSEC nya lalu pilih server BELANDA',
              buttons: [
                {

                  text: 'Install Chrome',
                  handler: () => {
                    window.open("https://chrome.google.com/webstore/detail/browsec-vpn-free-and-unli/omghfjlpggmjjaagoclmmobgdodcjboh");
                  }
                },
                {

                  text: 'Install Firefox',
                  handler: () => {
                    window.open("https://addons.mozilla.org/id/firefox/addon/browsec/");
                  }
                },
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                  }
                }
              ]
            });
            alert.present();
          }
        }
        else {

          if (error.message == 'Cannot load M3U8: Crossdomain access denied') {
            let alert = self.alertCtrl.create({
              title: 'CORS Error',
              message: 'File tidak berhasil diputar karena kendala CORS, untuk mengatasi harap download plugin CORS dan setelah terinstall harap Aktifkan plugin CORS nya',
              buttons: [
                {

                  text: 'Install Chrome',
                  handler: () => {
                    window.open("https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi");
                  }
                },
                {

                  text: 'Install Firefox',
                  handler: () => {
                    window.open("https://addons.mozilla.org/id/firefox/addon/cors-everywhere/");
                  }
                },
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                  }
                }
              ]
            });
            alert.present();
          }
        }
      });
    }
    else {
      this.stream = channel.stream
      this.urlembed = channel.url
      this.thumbnail = channel.thumbnail_picture
      this.title = channel.title
      this.quality = channel.quality
      this.episode = channel.episode
      this.nameanime = channel.name
      document.getElementById('embed').style.display = 'block'
      jwplayer('myElement').remove();
    }
  }
  doDetail(channel) {
    this.navCtrl.push('ChannelPage', {
      name: channel.name,
      category: channel.category,
      type: channel.type,
      stream: channel.stream
    })
  }

  doChangeChannel(all) {
    this.channels = [];
    if (all.type == 'TV') {
      this.api.get("table/z_channel_url", { params: { filter: "status='OPEN' AND id_channel='" + all.id_channel + "'", limit: 1000, sort: "id" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
        });
    }
    else if (all.type == 'LIVE') {
      this.api.get("table/z_channel_live_url", { params: { filter: "status='OPEN' AND id_channel='" + all.id + "'", limit: 1000, sort: "id" + " ASC " } })
        .subscribe(val => {
          this.channels = val['data']
        });
    }

    else if (this.type == 'STREAM') {
      if (this.name == 'Anime' || this.name == 'Film Series') {
        this.api.get("table/z_channel_stream_detail_url", { params: { filter: "status='OPEN' AND id_channel='" + all.id + "' AND episode='" + all.episode + "'", limit: 1000, sort: "quality" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            this.quality = this.channels[0].quality
          });
      }
      else {
        this.api.get("table/z_channel_stream_url", { params: { filter: "status='OPEN' AND id_channel='" + all.id_channel + "'", limit: 1000, sort: "id" + " ASC " } })
          .subscribe(val => {
            this.channels = val['data']
            this.quality = 'Trailer'
          });
      }
    }
    var self = this;
    this.urlembed = ''
    this.stream = all.stream
    this.url = all.url
    this.title = all.title
    this.quality = all.quality
    this.trailer = all.trailer
    this.episode = all.episode
    if (all.type == 'STREAM') {
      let url = all.trailer
      let urlembed = url.substring(32, 50)
      this.thumbnail = urlembed
      this.urlembed = urlembed
      this.title = 'Trailer'
      document.getElementById('embed').style.display = 'block'
    }
    else {

      if (all.stream != '') {
        document.getElementById('embed').style.display = 'none'
        jwplayer('myElement').setup({
          playlist: [{
            file: all.url,
            title: all.title,
            mediaid: '1'
          }],
          width: "100%",
          aspectratio: "16:9",
          stretching: "uniform",
          autostart: true,
          androidhls: true,
          displaydescription: true,
          displaytitle: true,
          visualplaylist: false,
          skin: { "active": "#DF2148", "inactive": "#CCCCCC", "name": "glow" },
          plugins: {
            "https://www.metube.id/cc-content/themes/default/js/ping.js": { "pixel": "//content.jwplatform.com/ping.gif" }
          }
        });
        jwplayer('myElement').on('play', function () {
        });
        jwplayer('myElement').on('adError', function (error) {
        });
        jwplayer('myElement').on('fullscreen', function (e) {
          if (e.fullscreen == true) {
            self.admob.removeBanner()
            self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.LANDSCAPE);
            self.androidFullScreen.isImmersiveModeSupported()
              .then(() => self.androidFullScreen.immersiveMode())
              .catch(err => console.log(err));
          }
          else {
            var admobid = {
              banner: self.ads[0].ads_banner,
              interstitial: self.ads[0].ads_interstitial
            };

            self.admob.createBanner({
              adSize: 'SMART_BANNER',
              adId: admobid.banner,
              isTesting: self.ads[0].testing,
              autoShow: true,
              position: self.admob.AD_POSITION.BOTTOM_CENTER,
            });
            self.screenOrientation.lock(self.screenOrientation.ORIENTATIONS.PORTRAIT);
            self.androidFullScreen.isImmersiveModeSupported()
              .then(() => self.androidFullScreen.showSystemUI())
              .catch(err => console.log(err));
          }
        })
        jwplayer('myElement').on('error', function (error) {
          if (all.url.match(/210.210.155.35/)) {
            if (error.message == 'Cannot load M3U8: Crossdomain access denied') {
              let alert = self.alertCtrl.create({
                title: 'CORS Error',
                message: 'File tidak berhasil diputar karena kendala ISP yang memblock file streaming, untuk mengatasi harap download plugin BROWSEC dan setelah terinstall harap Aktifkan plugin BROWSEC nya lalu pilih server BELANDA',
                buttons: [
                  {

                    text: 'Install Chrome',
                    handler: () => {
                      window.open("https://chrome.google.com/webstore/detail/browsec-vpn-free-and-unli/omghfjlpggmjjaagoclmmobgdodcjboh");
                    }
                  },
                  {

                    text: 'Install Firefox',
                    handler: () => {
                      window.open("https://addons.mozilla.org/id/firefox/addon/browsec/");
                    }
                  },
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                  }
                ]
              });
              alert.present();
            }
          }
          else {

            if (error.message == 'Cannot load M3U8: Crossdomain access denied') {
              let alert = self.alertCtrl.create({
                title: 'CORS Error',
                message: 'File tidak berhasil diputar karena kendala CORS, untuk mengatasi harap download plugin CORS dan setelah terinstall harap Aktifkan plugin CORS nya',
                buttons: [
                  {

                    text: 'Install Chrome',
                    handler: () => {
                      window.open("https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi");
                    }
                  },
                  {

                    text: 'Install Firefox',
                    handler: () => {
                      window.open("https://addons.mozilla.org/id/firefox/addon/cors-everywhere/");
                    }
                  },
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                  }
                ]
              });
              alert.present();
            }
          }
        });
      }
      else {
        this.stream = all.stream
        this.urlembed = all.url
        this.thumbnail = all.thumbnail_picture
        this.title = all.title
        this.quality = all.quality
        this.trailer = all.trailer
        this.episode = all.episode
        document.getElementById('embed').style.display = 'block'
        jwplayer('myElement').remove();
      }
    }
  }
  doTrailer() {
    console.log('trailer')
    if (this.name == 'Anime' || this.name == 'Film Series') {
      let url = this.navParam.get('trailer')
      let urlembed = url.substring(32, 50)
      this.thumbnail = urlembed
      this.urlembed = urlembed
      this.quality = 'Trailer'
    }
    else {
      let url = this.trailer
      let urlembed = url.substring(32, 50)
      this.thumbnail = urlembed
      this.urlembed = urlembed
      this.quality = 'Trailer'
    }
  }
  doPlayYoutube() {
    this.youtube.openVideo(this.urlembed);
  }
  doPlayEmbed() {
    this.navCtrl.push('PlayerembedPage', {
      url: this.urlembed
    })
  }
  ionViewWillLeave() {
    this.admob.removeBanner();
  }
  ionViewDidEnter() {
    if (this.widthscreen < this.heightscreen) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.androidFullScreen.isImmersiveModeSupported()
        .then(() => this.androidFullScreen.showSystemUI())
        .catch(err => console.log(err));
    }
    this.appVersion.getPackageName().then((name) => {
      this
        .packagename = name;
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
  doHome() {
    this.app.getRootNav().setRoot(HomePage)
  }
  doGetTV() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_url", { params: { limit: 30, offset: offset, filter: "status='OPEN' AND name='" + this.name + "'", sort: "title" + " ASC,quality ASC" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channelall.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetStream() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_stream_url", { params: { limit: 30, offset: offset, filter: "status='OPEN' AND name='" + this.name + "'", sort: "title" + " ASC,quality ASC" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channelall.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetStreamDetail() {
    console.log('stream detail')
    console.log(this.halaman)
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_stream_detail", { params: { limit: 30, offset: offset, filter: "status='OPEN' AND name='" + this.title + "'", sort: "episode" + " DESC" } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channelall.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doGetLive() {
    return new Promise(resolve => {
      let offset = 30 * this.halaman
      if (this.halaman == -1) {
        resolve();
      }
      else {
        this.halaman++;
        this.api.get("table/z_channel_live", { params: { limit: 30, offset: offset, filter: "datestart <=" + "'" + this.datetimecurrent + "'" + " AND " + "datefinish >" + "'" + this.datetimecurrent + "' AND status ='OPEN'", sort: "datestart" + " ASC " } })
          .subscribe(val => {
            let data = val['data'];
            for (let i = 0; i < data.length; i++) {
              this.channelall.push(data[i]);
            }
            if (data.length == 0) {
              this.halaman = -1
            }
            resolve();
          });
      }
    });
  }
  doInfinite(infiniteScroll) {
    if (this.type == 'TV') {
      this.doGetTV().then(response => {
        infiniteScroll.complete();
      });
    }
    else if (this.type == 'STREAM') {
      console.log(this.name)
      if (this.name == 'Anime' || this.name == 'Film Series') {
        this.doGetStreamDetail().then(response => {
          infiniteScroll.complete();
        });
      }
      else {
        this.doGetStream().then(response => {
          infiniteScroll.complete();
        });
      }
    }
    else if (this.type == 'LIVE') {
      this.doGetLive().then(response => {
        infiniteScroll.complete();
      });
    }
  }
}
