import { Component, OnInit } from '@angular/core';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';
import { FingerPrintService } from 'src/app/directives/fingerPrint/finger-print.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-finger-print',
  templateUrl: './finger-print.component.html',
  styleUrls: ['./finger-print.component.scss'],
})
export class FingerPrintComponent implements OnInit {

  public eliminarHuella = false;
  public anadirHuella = false;

  constructor(public navParams: NavParams, public modalCtrl: ModalController, private androidFingerprintAuth: AndroidFingerprintAuth,
    private fingerPrint: FingerPrintService, private alertController: AlertController) { }

  ngOnInit() {
    var huella = this.fingerPrint.obtenerDatosHuellaDactilar();
    if (huella == null) {
      this.anadirHuella = true;
      this.eliminarHuella = false;
    } else {
      this.anadirHuella = false;
      this.eliminarHuella = true;
    }
  }

  public escanearHuellaDactilar() {
    this.androidFingerprintAuth.isAvailable().then((result) => {
      if (result.isAvailable) {
        this.registrarHuellaDactilar();
      } else {
        this.mostrarAlerta("Acceso Biométrico", " ", "La autenticación de huellas dactilares no está disponible.");
        this.modalCtrl.dismiss();
      }
    }).catch(error => {
      this.mostrarAlerta("Acceso Biométrico", " ", "" + JSON.stringify(error));
      this.modalCtrl.dismiss();
    });

  }

  public registrarHuellaDactilar() {
    var cliente = {
      clientId: this.navParams.data.clientId,
      username: this.navParams.data.username,
      password: "ELECTRONIX-EC" + this.navParams.data.clientId,
      locale: "es"
    };

    this.androidFingerprintAuth.encrypt(cliente).then(result => {
      if (result.withFingerprint) {
        this.fingerPrint.registrarHuellaDactilar({ clientId: this.navParams.data.clientId, username: this.navParams.data.username, token: result.token });
        this.mostrarAlerta("Acceso Biométrico", " ", "Credenciales cifradas con éxito.");
        this.modalCtrl.dismiss();
      } else if (result.withBackup) {
        this.fingerPrint.registrarHuellaDactilar({ clientId: this.navParams.data.clientId, username: this.navParams.data.username, token: result.token });
        this.mostrarAlerta("Acceso Biométrico", " ", "¡Autentificado exitosamente con contraseña de respaldo!");
        this.modalCtrl.dismiss();
      } else this.mostrarAlerta("Acceso Biométrico", " ", "No se logró autenticar.");
    }).catch(error => {
      if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
        this.mostrarAlerta("Acceso Biométrico", " ", "Autenticación de huellas dactilares cancelada.");
        this.modalCtrl.dismiss();
      } else {
        this.mostrarAlerta("Acceso Biométrico", " ", "" + JSON.stringify(error));
        this.modalCtrl.dismiss();
      }
    });
  }

  public eliminarHuellaDactilar() {
    var datos = JSON.parse(this.fingerPrint.obtenerDatosHuellaDactilar());
    var eliminar = {
      clientId: datos.clientId,
      username: datos.username
    }
    this.androidFingerprintAuth.delete(eliminar).then(result => {
      this.fingerPrint.eliminarHuellaDactilar();
      this.mostrarAlerta("Acceso Biométrico", " ", "Cifrado eliminado con éxito.");
      this.modalCtrl.dismiss();
    }).catch(error => {
      this.mostrarAlerta("Acceso Biométrico", " ", "" + JSON.stringify(error));
      this.modalCtrl.dismiss();
    });

  }

  public async mostrarAlerta(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      mode: 'ios',
      cssClass: 'font',
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'alert-accept'
        }
      ]
    });
    await alert.present();
  }

}
