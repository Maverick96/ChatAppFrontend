import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from 'src/app/app.constants';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(payload) {
    return this.http.post(`${BASE_URL}/login`, payload);
  }

  signUp(payload) {
    return this.http.post(`${BASE_URL}/register`, payload);
  }

  logout(payload) {
    return this.http.post(`${BASE_URL}/logout`, payload);
  }
}
