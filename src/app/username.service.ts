import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsernameService {

  constructor(private http: HttpClient) { }

  usernameuniqe(username: any) {
    this.http.get('http://localhost:8000/api/usernameuniqe/' + username + '/')
    .subscribe(res => {
      return res
    })
    return false
  }

  get user(){
    let token: any = localStorage.getItem('token')
    let user = new JwtHelperService()
    return user.decodeToken(token)
  }


}
