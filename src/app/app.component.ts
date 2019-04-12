import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (localStorage.getItem("Electronix-EC") === null) {
        this.router.navigate(['/electronix/login']);
        this.splashScreen.hide();
      }else{
        this.splashScreen.hide();
      }
      this.statusBar.styleDefault();
      this.conectar();
    });
  }

  conectar(){
    var config = {
      apiKey: "AIzaSyAYqvaR6t4xsF1ql5Iov4-oNBm9ykQQx4U",
      authDomain: "electronix-ec.firebaseapp.com",
      databaseURL: "https://electronix-ec.firebaseio.com",
      projectId: "electronix-ec",
      storageBucket: "electronix-ec.appspot.com",
      messagingSenderId: "913838498044"
    };
    firebase.initializeApp(config);
  }
}
