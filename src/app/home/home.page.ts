import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.verificarCredenciales();
  }

  verificarCredenciales() {
    if (localStorage.getItem("Electronix-EC") != null) {
      this.router.navigate(['/electronix/tienda/productos']);
    }
  }

  public iniciarSesion(){
    this.router.navigate(["/electronix/login"]);
  }

  public registrarUsuario(){
    this.router.navigate(["/electronix/register"]);
  }
}
