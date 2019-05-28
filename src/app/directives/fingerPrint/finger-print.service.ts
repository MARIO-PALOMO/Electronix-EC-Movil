import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FingerPrintService {

  constructor() { }

  registrarHuellaDactilar(usuario: any) {
    localStorage.setItem('Electronix-EC-FingerPrint', JSON.stringify(usuario));
  }

  obtenerDatosHuellaDactilar() {
    return localStorage.getItem("Electronix-EC-FingerPrint");
  }

  eliminarHuellaDactilar(){
    localStorage.removeItem('Electronix-EC-FingerPrint');
  }
}
