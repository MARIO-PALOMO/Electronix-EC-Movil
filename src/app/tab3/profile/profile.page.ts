import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/service/conexion/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public clienteForm: FormGroup;

  constructor(public navParams: NavParams, private modalController: ModalController, private conexion: ApiService, private alertController: AlertController, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.inicializarFormulario();
  }

  public inicializarFormulario() {
    this.clienteForm = this.formBuilder.group({
      idCliente: [this.navParams.data.cliente.idCliente, Validators.required],
      nombre: [this.navParams.data.cliente.nombre, Validators.required],
      identificacion: [this.navParams.data.cliente.identificacion, [Validators.required]],
      direccion: [this.navParams.data.cliente.direccion, [Validators.required]],
      telefono: [this.navParams.data.cliente.telefono, Validators.required]
    });
  }

  public actualizarDatos() {

    if (this.clienteForm.controls.nombre.status == "INVALID") {
      this.mostrarAlerta("ELECTRONIX", "Ingresar un valor en nombre.");
    } else if (this.clienteForm.controls.identificacion.status == "INVALID") {
      this.mostrarAlerta("ELECTRONIX", "Ingresar un valor en identificación.");
    } else if (this.clienteForm.controls.direccion.status == "INVALID") {
      this.mostrarAlerta("ELECTRONIX", "Ingresar un valor en dirección.");
    } else if (this.clienteForm.controls.telefono.status == "INVALID") {
      this.mostrarAlerta("ELECTRONIX", "Ingresar un valor en teléfono.");
    } else if (this.clienteForm.invalid) {
      this.mostrarAlerta("ELECTRONIX", "Un valor en el formulario es incorrecto.");
    } else {
      this.conexion.post("modificarCliente", this.clienteForm.value, this.navParams.data.token).subscribe(
        (res: any) => {
          this.mostrarAlerta("ELECTRONIX", "Datos actualizados correctamente.");
          this.modalController.dismiss({
            valor: true
          });
        }, err => {
          console.log(err);
          this.mostrarAlerta("ELECTRONIX", "No se logró conectar con el servidor de datos.");
        }
      );
    }
  }

  public cerrarModal(){
    this.modalController.dismiss();
  }

  public async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
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
