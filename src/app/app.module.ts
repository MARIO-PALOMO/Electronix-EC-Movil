import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FingerPrintComponent } from './tab3/finger-print/finger-print.component';
import { ProfilePage } from './tab3/profile/profile.page';
import { TarjetasPage } from './tab3/tarjetas/tarjetas.page';

import { ApiService } from './service/conexion/api.service';
import { LoginService } from './directives/login/login.service';
import { FirebaseService } from './service/firebase/firebase.service';
import { FingerPrintService } from './directives/fingerPrint/finger-print.service';

import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx';
import { CardIO } from '@ionic-native/card-io/ngx';

import { Facebook } from '@ionic-native/facebook/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';
 
@NgModule({
  declarations: [AppComponent, FingerPrintComponent, ProfilePage, TarjetasPage],
  entryComponents: [FingerPrintComponent, ProfilePage, TarjetasPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Facebook,
    TwitterConnect,
    ApiService,
    LoginService,
    FirebaseService,
    FingerPrintService,
    Camera,
    AndroidFingerprintAuth,
    CardIO
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
