import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/conexion/api.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginService } from '../directives/login/login.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public usuario = {
    email: "",
    contrasena: "",
    rol: "CLIENTE",
    plataforma: "ELECTRONIX"
  }

  public cliente = {
    identificacion: "0",
    nombre: "",
    telefono: "0",
    direccion: "0",
    idUsuario: 0
  }

  constructor(private conexion: ApiService, public alertController: AlertController, private router: Router, private validacion: LoginService) { }

  ngOnInit() {
  }

  public registrarUsuario() {
    var regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var regexContrasena = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z].{8,}/;

    if (this.cliente.nombre == "") {
      this.mostrarAlerta("ELECTRONIX", " ", "Ingresar el nombre completo.");
    } else if (this.usuario.email == "") {
      this.mostrarAlerta("ELECTRONIX", " ", "Ingresar un correo electrónico.");
    } else if (!regexEmail.test(this.usuario.email)) {
      this.mostrarAlerta("ELECTRONIX", " ", "Ingresar una dirección de correo electrónico válida.");
    } else if (this.usuario.contrasena == "") {
      this.mostrarAlerta("ELECTRONIX", " ", "Ingresar una contraseña.");
    }
    else if (!regexContrasena.test(this.usuario.contrasena)) {
      this.mostrarAlerta("ELECTRONIX", " ", "Ingresar una contraseña que contenga mas de 8 caracteres, mayúsculas, minúsculas y números.");
    } else {
      this.guardarUsuario();
    }
  }

  public guardarUsuario() {
    this.conexion.post("guardarUsuario", this.usuario, "").subscribe(
      (res: any) => {
        this.cliente.idUsuario = res.insertId;
        this.conexion.post("guardarClienteUsuario", this.cliente, "").subscribe(
          (res: any) => {
            this.conexion.post("login", this.usuario, "").subscribe(
              (res: any) => {
                this.validacion.iniciarSesion(res);
                this.router.navigate(['/electronix/welcome/' + this.cliente.nombre]);
      
              }, err => {
                console.log(err);
                this.mostrarAlerta("ELECTRONIX", "Error Servidor", "No se logró conectar con el servidor de datos.");
              }
            );
            console.log(res);
          }, err => {
            this.mostrarAlerta("ELECTRONIX", "Error Servidor", "No se logró conectar con el servidor de datos.");
            console.log(err);
          }
        );
      }, err => {
        this.mostrarAlerta("ELECTRONIX", " ", "Es posible que el correo electrónico que desea ingresar ya se encuentre registrado.");
        console.log(err);
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
