import { Component } from '@angular/core';
import { LoginService } from './../directives/login/login.service';
import { ApiService } from '../service/conexion/api.service';
import { AlertController, ModalController } from '@ionic/angular';
import { FingerPrintComponent } from './finger-print/finger-print.component';
import { ProfilePage } from './profile/profile.page';
import { TarjetasPage } from './tarjetas/tarjetas.page';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public usuario: any;
  public lstCliente: any = [];

  constructor(private validacion: LoginService, private conexion: ApiService, private alertController: AlertController, private modalController: ModalController) {
    this.usuario = JSON.parse(this.validacion.obtenerDatos());
    this.obtenerDatosCliente();
  }

  public cerrarSesion() {
    this.validacion.cerrarSesion();
  }

  public async modalHuellasDigitales() {
    const modal = await this.modalController.create({
      component: FingerPrintComponent,
      componentProps: { clientId: this.usuario.usuario.idCliente, username: this.usuario.usuario.email },
      cssClass: 'modal-finger'
    });
    return await modal.present();
  }

  public async modalPerfil() {
    const modal = await this.modalController.create({
      component: ProfilePage,
      componentProps: { cliente: this.lstCliente, token: this.usuario.token }
    });

    modal.onDidDismiss().then((data: any) => {
      if (data.data.valor) {
        this.obtenerDatosCliente();
      }
    }).catch((error)=> {
      //console.log(error);
    });

    return await modal.present();
  }

  public async modalTarjetas() {
    const modal = await this.modalController.create({
      component: TarjetasPage,
      componentProps: { idCliente: this.usuario.usuario.idCliente, token: this.usuario.token }
    });

    return await modal.present();
  }

  public obtenerDatosCliente() {
    this.conexion.get("buscarCliente?idCliente=" + this.usuario.usuario.idCliente, this.usuario.token).subscribe(
      (res: any) => {
        this.lstCliente = res[0];
      }, err => {
        console.log(err);
        this.mostrarAlerta("ELECTRONIX", "Error Servidor", "No se logró conectar con el servidor de datos.");
      }
    );
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
