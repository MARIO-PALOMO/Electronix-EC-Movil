import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public referenciaStorage: any;

  constructor() { 
    this.referenciaStorage = firebase.storage().ref('/Clientes/');
  }

  public subirFoto(imagen: any, nombreImagen: any){
    return new Promise<any>((resolve, reject) => {
      this.referenciaStorage.child(''+nombreImagen+'.jpeg').putString(imagen, 'base64', { contentType: 'image/jpeg' }).then((savedPicture) => {

        resolve(savedPicture);

      }).catch((error)=> {

        reject(error);

      });
    });
  }

  public listarLinkFoto(nombreImagen: any){
    return new Promise<any>((resolve, reject) => {
      firebase.storage().ref().child('Clientes/'+nombreImagen+'.jpeg').getDownloadURL().then((url) => {

        resolve(url);
  
      }).catch((error) => {
  
        reject(error);
  
      });
    });
  }
}
