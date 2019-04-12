import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { TwitterConnect } from '@ionic-native/twitter-connect/ngx';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private fb: Facebook, private tw: TwitterConnect, private router: Router) { }

  cerrarSesion() {
    localStorage.removeItem('Electronix-EC');
    this.fb.logout().then((res) => {
      alert(res);
    }, err => {
      alert(err);
    });
    this.tw.logout().then((res) => {
      alert(res);
    }, err => {
      alert(err);
    });
    this.router.navigate(["/electronix/login"]);
  }

  iniciarSesion(usuario: any) {
    localStorage.setItem('Electronix-EC', JSON.stringify(usuario));
    this.router.navigate(['/electronix/tienda/productos']);
  }

  verificarCredenciales() {
    if (localStorage.getItem("Electronix-EC") === null) {
      this.router.navigate(['/electronix/login']);
    }
  }

  obtenerDatos() {
    return localStorage.getItem("Electronix-EC");
  }
}
