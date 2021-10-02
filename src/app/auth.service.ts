// import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/add/operator/map'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  UsernameCheck (username: any) {
    let data = {
      "username": username
    }
    console.log(JSON.stringify(data))
    return this.http.post('http://localhost:8000/api/check/', JSON.stringify(data))
  }


  Login (form: any) {
    return this.http.post('http://localhost:8000/api/token/', JSON.stringify(form))
    .map(res => {
      let result: any = res
      if (result && result?.access){
        localStorage.setItem('token', result?.access)
        return true
      }
      return false
    })
  }
  Logout () {
    localStorage.removeItem('token')
  }


  logincheck() {
    if (localStorage.getItem('token')) {
      let jwthelper = new JwtHelperService()
      let token: any = localStorage.getItem('token')
      let expired = jwthelper.isTokenExpired(token)
      return !expired
    }
    return false
  }

  get user(){
    let token: any = localStorage.getItem('token')
    let user = new JwtHelperService()
    return user.decodeToken(token)
  }

  userdetail(user_id: any) {
    return this.http.get('http://localhost:8000/api/showuser/' + user_id + '/')
  }
}