import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApiService } from './service/conexion/api.service';
import { LoginService } from './directives/login/login.service';
import { FirebaseService } from './service/firebase/firebase.service';

import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';

import { Facebook } from '@ionic-native/facebook/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook,
    TwitterConnect,
    ApiService,
    LoginService,
    FirebaseService,
    Camera
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
