import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public url: string = 'http://192.168.100.8:3000/';

  constructor(private http: HttpClient) { }

  post(endpoint: string, body: any, token: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": "" + token + ""
      })
    };
    return this.http.post(this.url + "" + endpoint, body, httpOptions);
  }

  get(endpoint: string, token: any, params?: any, reqOpts?: any): Observable<any> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params.set(k, params[k]);
      }
    }

    reqOpts = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "authorization": "" + token + ""
      })
    };

    return this.http.get(this.url + "" + endpoint, reqOpts);
  }

}
