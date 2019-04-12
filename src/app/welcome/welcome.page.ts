import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { LoginService } from '../directives/login/login.service';
import { FirebaseService } from '../service/firebase/firebase.service';
import { ApiService } from '../service/conexion/api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  public cargando: any;
  public nombre: any;
  public usuario: any;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private camera: Camera, private validacion: LoginService, private firebase: FirebaseService, private conexion: ApiService,
    private alertController: AlertController, private loadingController: LoadingController) {
  }

  ngOnInit() {
    this.nombre = this.activatedRoute.snapshot.paramMap.get('nombre');
    this.usuario = JSON.parse(this.validacion.obtenerDatos());
  }

  public capturarFoto() {
    const options: CameraOptions = {
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }

    this.camera.getPicture(options).then((imageData) => {
      this.subirFoto(imageData);
    }, (err) => {
      console.log(err);
      this.mostrarAlerta("ELECTRONIX", " ", "Ocurrió un error al intentar capturar la foto para su perfil, lo puede intentar más tarde en el apartado de PERFIL en el inicio de la aplicación.");
    });
  }

  public subirFoto(imagen: any) {
    this.mostrarCargando();
    this.firebase.subirFoto(imagen, this.usuario.usuario.idCliente).then((res) => {
      this.listarLinkFoto();
    }, (err) => {
      console.log(err);
      this.cargando.dismiss();
      this.mostrarAlerta("FIREBASE", " ", "Ocurrió un error al intentar procesar la fotografía, intente nuevamente.");
    });
  }

  public listarLinkFoto() {
    this.firebase.listarLinkFoto(this.usuario.usuario.idCliente).then((url) => {
      this.actualizarFoto(url);
    }, (err) => {
      console.log(err);
      this.cargando.dismiss();
      this.mostrarAlerta("FIREBASE", " ", "Ocurrió un error al intentar obtener la fotografía, intente nuevamente.");
    });
  }

  public actualizarFoto(foto) {
    this.conexion.post("modificarClienteFoto", { foto: foto, fotoLugar: "FIREBASE", idCliente: this.usuario.usuario.idCliente }, this.usuario.token).subscribe(
      (res: any) => {
        this.cargando.dismiss();
        this.mostrarAlerta("ELECTRONIX", "", "Su fotografía ha sido procesada exitosamente.");
        this.router.navigate(['/electronix/tienda/productos']);
      }, err => {
        console.log(err);
        this.cargando.dismiss();
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

  public async mostrarAlertaFoto() {
    const alert = await this.alertController.create({
      header: 'ELECTRONIX',
      message: 'Es necesario capturar una fotografía para visualizar en su perfil y poder realizar los pagos en línea.',
      mode: 'ios',
      cssClass: 'font',
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'alert-accept',
          handler: (e) => {
            this.capturarFoto();
          }
        }
      ]
    });
    await alert.present();
  }

  public async mostrarCargando() {
    this.cargando = await this.loadingController.create({
      mode: "ios",
      spinner: "bubbles",
      message: "Procesando Imagen"
    });
    await this.cargando.present();
  }

}
