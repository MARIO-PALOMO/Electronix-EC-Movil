import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/service/conexion/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardIO, CardIOOptions, CardIOResponse } from '@ionic-native/card-io/ngx';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.page.html',
  styleUrls: ['./tarjetas.page.scss'],
})
export class TarjetasPage implements OnInit {

  public lstTarjetas = [];
  public clienteTarjetasForm: FormGroup;
  public resultados: CardIOResponse;

  constructor(public navParams: NavParams, private modalController: ModalController, private conexion: ApiService,
    private alertController: AlertController, private formBuilder: FormBuilder, public card: CardIO, public platform: Platform) { }

  ngOnInit() {
    this.listarTarjetas();
  }

  async agregarTarjeta() {
    try {
      await this.platform.ready();
      const canScan = await this.card.canScan();

      if (canScan) {
        const options: CardIOOptions = {
          scanExpiry: true,
          hideCardIOLogo: true,
          requireExpiry: true,
          requireCVV: true,
          requireCardholderName: true,
          guideColor: "#df393a"
        };

        this.resultados = await this.card.scan(options);

        this.conexion.post("guardarTarjeta", {"tarjeta": this.resultados, "cliente": this.navParams.data.idCliente}, this.navParams.data.token).subscribe(
          (res: any) => {
            this.mostrarAlerta('Escaner Tarjetas', 'Tarjeta agregada exitosamente');
          },
          err => {
            console.log(err);
            this.mostrarAlerta('Escaner Tarjetas', 'Error al Agregar Tarjeta: ' + JSON.stringify(err));
          }
        );
      }
    } catch (e) {
      var error = JSON.stringify(e);
      if (error == '"card scan cancelled"') {
        this.mostrarAlerta('Escaner Tarjetas', 'Ha cancelado el registro de la tarjeta.');
      } else {
        this.mostrarAlerta('Escaner Tarjetas', 'Error: ' + error);
      }

    }
  }

  public listarTarjetas() {
    this.conexion.get("buscarTarjeta?idCliente=" + this.navParams.data.idCliente, this.navParams.data.token).subscribe(
      (res: any) => {
        this.lstTarjetas = res[0];
      }, err => {
        console.log(err);
        this.mostrarAlerta("ELECTRONIX", "No se logró conectar con el servidor de datos.");
      }
    );
  }

  public cerrarModals() {
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
