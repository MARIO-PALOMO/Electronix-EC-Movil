import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { LoginService } from '../directives/login/login.service';
import { ApiService } from '../service/conexion/api.service';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth/ngx';
import { FingerPrintService } from '../directives/fingerPrint/finger-print.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  public usuario = {
    email: "",
    contrasena: ""
  }
  public verificarHuella_ = false;

  constructor(private fb: Facebook, private tw: TwitterConnect, private conexion: ApiService,
    private validacion: LoginService, public alertController: AlertController, private router: Router,
    private androidFingerprintAuth: AndroidFingerprintAuth, private fingerPrint: FingerPrintService) { }

  ngOnInit() {
    this.verificarCredenciales();
    this.verificarHuellaDigital();
  }

  public verificarCredenciales() {
    if (localStorage.getItem("Electronix-EC") != null) {
      this.router.navigate(['/electronix/tienda/productos']);
    }
  }

  public verificarHuellaDigital() {
    var huella = this.fingerPrint.obtenerDatosHuellaDactilar();
    if (huella != null) {
      this.verificarHuella_ = true;
    } else {
      this.verificarHuella_ = false;
    }
  }

  public obtenerHuellaDactilar() {
    var datos = JSON.parse(this.fingerPrint.obtenerDatosHuellaDactilar());
    this.androidFingerprintAuth.decrypt(datos).then(result => {

      if (result.withFingerprint) {
        this.verificarUsuario(datos.username).then((res) => {
          var idUsuario = res;
          this.buscarUsuario(idUsuario).then((res) => {
            this.validacion.iniciarSesion(res);
          });
        });
      } else if (result.withBackup) {
        this.verificarUsuario(datos.username).then((res) => {
          var idUsuario = res;
          this.buscarUsuario(idUsuario).then((res) => {
            this.validacion.iniciarSesion(res);
          });
        });
      }
    }).catch(error => {
      this.mostrarAlerta("Acceso Biométrico", " ", "" + JSON.stringify(error));
    });
  }

  public iniciarSesionElectronix() {
    var regexEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (this.usuario.email == "") {
      this.mostrarAlerta("ELECTRONIX", "", "Ingresar un correo electrónico.");
    } else if (!regexEmail.test(this.usuario.email)) {
      this.mostrarAlerta("ELECTRONIX", "", "Ingresar una dirección de correo electrónico válida.");
    } else if (this.usuario.contrasena == "") {
      this.mostrarAlerta("ELECTRONIX", "", "Ingresar una contraseña.");
    } else {
      this.conexion.post("login", this.usuario, "").subscribe(
        (res: any) => {
          if (res == false) {
            this.mostrarAlerta("ELECTRONIX", "", "Las credenciales ingresadas son incorrectas, o no es un cliente registrado.");
          } else {
            if (res.usuario.rol == "CLIENTE") {
              this.validacion.iniciarSesion(res);
            } else {
              this.mostrarAlerta("ELECTRONIX", "", "Las credenciales ingresadas no pertenecen a un cliente, verifiquelas nuevamente.");
            }
          }

        },
        err => {
          console.log(err);
          this.mostrarAlerta("ELECTRONIX", "Error Servidor", "No se logró conectar con el servidor de datos. " +JSON.stringify(err));
        }
      );
    }
  }

  public iniciarSesionFacebook() {
    const permissions = ['public_profile', 'user_friends', 'email'];
    this.fb.login(permissions).then((resLogin: FacebookLoginResponse) => {

      this.fb.api("/me?fields=name,email", permissions).then(user => {

        this.gestionSesionRedesSociales(user.email, user.name, "FACEBOOK");

      }).catch(e => {
        this.mostrarAlerta("FACEBOOK", "No se logró conectar con Facebook", "No se logró capturar la información necesaria para iniciar sesión.");
      });
    }).catch(e => {
      this.mostrarAlerta("FACEBOOK", "No se logró conectar con Facebook", "Por favor intentar ingresar a la aplicación desde otra opción.");
    });
  }

  public inicioSesionTwitter() {
    this.tw.login().then(res => {
      this.tw.showUser().then(user => {
        this.mostrarAlertaEmail(user.name);
      }, err => {
        console.log(err);
        this.mostrarAlerta("TWITTER", "No se logró conectar con Twitter", "No se logró capturar la información necesaria para iniciar sesión.");
      })
    }, err => {
      console.log(err);
      this.mostrarAlerta("TWITTER", "No se logró conectar con Twitter", "Por favor intentar ingresar a la aplicación desde otra opción.");
    });
  }

  public gestionSesionRedesSociales(email, nombre, redSocial) {
    this.verificarUsuario(email).then((res) => {
      var idUsuario = res;
      if (res == 0) {
        this.guardarUsuario(email, redSocial, "CLIENTE", redSocial).then((res) => {
          var usuarioNuevo = res.insertId;
          this.guardarCliente(nombre, usuarioNuevo).then((res) => {
            this.buscarUsuario(usuarioNuevo).then((res) => {
              this.validacion.iniciarSesion(res);
            });
          });
        });
      } else {
        this.buscarUsuario(idUsuario).then((res) => {
          this.validacion.iniciarSesion(res);
        });
      }
    });
  }

  public verificarUsuario(email) {
    return new Promise<any>((resolve, reject) => {
      this.conexion.get("comprobarExistenciaUsuario?email=" + email, "").subscribe(
        (res: any) => {
          var idUsuario: any;
          if (res.length != 0) {
            idUsuario = res[0].idUsuario;
          } else {
            idUsuario = 0;
          }
          resolve(idUsuario);
        },
        err => {
          reject(0);
        }
      );
    });

  }

  public buscarUsuario(idUsuario) {
    return new Promise<any>((resolve, reject) => {
      this.conexion.get("buscarUsuario?idUsuario=" + idUsuario, "").subscribe(
        (res: any) => {
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public guardarUsuario(email, contrasena, rol, plataforma) {
    return new Promise<any>((resolve, reject) => {
      this.conexion.post("guardarUsuario", { email: email, contrasena: contrasena, rol: rol, plataforma: plataforma }, "").subscribe(
        (res: any) => {
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public guardarCliente(nombre, idUsuario) {
    return new Promise<any>((resolve, reject) => {
      this.conexion.post("guardarClienteUsuario", { identificacion: "0", nombre: nombre, telefono: "0", direccion: "0", idUsuario: idUsuario }, "").subscribe(
        (res: any) => {
          resolve(res);
        },
        err => {
          console.log(err);
          reject(err);
        }
      );
    });
  }

  public async mostrarAlertaEmail(nombre) {
    const alert = await this.alertController.create({
      header: 'TWITTER',
      subHeader: 'Es necesario verificar su correo electrónico',
      mode: 'ios',
      cssClass: 'font',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Ingrese su correo electrónico'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel'
        }, {
          text: 'Aceptar',
          cssClass: 'alert-accept',
          handler: (e) => {
            this.gestionSesionRedesSociales(e.email, nombre, "TWITTER");
          }
        }
      ]
    });
    await alert.present();
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



  /*
      return new Promise<any>((resolve, reject) => {
  
      });
  */

}
