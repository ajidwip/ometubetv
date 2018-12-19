import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {

  private api_url = 'http://101.255.60.202/webapi5/api';

  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any) {
    return this.http.get(this.api_url + '/' + endpoint, params);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.api_url + '/' + endpoint, body, reqOpts)
  }
  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.api_url + '/' + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.api_url + '/' + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.api_url + '/' + endpoint, body, reqOpts);
  }
}
