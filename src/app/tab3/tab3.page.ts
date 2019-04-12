import { Component } from '@angular/core';
import { LoginService } from './../directives/login/login.service';
import { ApiService } from '../service/conexion/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public usuario: any;
  public lstCliente = [];
  public cliente = {
    identificacion: "",
    nombre: "",
    telefono: "",
    direccion: "",
    foto: "",
    fotoLugar: "",
  }

  constructor(private validacion: LoginService, private conexion: ApiService, private alertController: AlertController){
    this.usuario = JSON.parse(this.validacion.obtenerDatos());
    this.obtenerDatosCliente();
    console.log(this.usuario);
  }

  public cerrarSesion(){
    this.validacion.cerrarSesion();
  }

  public obtenerDatosCliente() {
    this.conexion.get("buscarCliente?idCliente="+ this.usuario.usuario.idCliente, this.usuario.token).subscribe(
      (res: any) => {
        this.lstCliente = res[0];
        console.log(this.lstCliente);
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
