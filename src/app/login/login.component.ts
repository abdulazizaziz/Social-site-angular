import { AppComponent } from './../app.component';
import { AuthService } from './../auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor (private auth: AuthService, private app: AppComponent) {}

  signup: boolean = false
  signType () {
    this.signup = !this.signup
  }
  login () {
    // console.log(this.loginForm.value)
    this.auth.Login(this.loginForm.value)
    .subscribe(res => {
      if (res){
        this.app.login()
      }
    }, error => {
      Swal.fire({
        'title': "Email and/or Password is incorrect!",
        'icon': 'error'
      })
    })
  }


  
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required, Validators.email
    ]),
    password: new FormControl('',[
      Validators.required
    ])
  })
  get lemail() {
    return this.loginForm.get('email')
  }
  get lpassword() {
    return this.loginForm.get('password')
  }




  SignIn (user: any) {
    this.auth.UsernameCheck(user.value)
      .subscribe(res => console.log(res))
    // console.log(email.invalid)
    // var data = { "password": "123", "email": "aziz123@gmail.com", "name": "Aziz", "gender": "male" }
    // this.http.post('http://localhost:8000/api/users/', JSON.stringify(data))
    //   .subscribe(res => console.log(res))
  }






  focuss (elem: any) {
    elem.nextElementSibling.style.height = "36px"
  }
  blurr (elem: any){
    if(elem.value == ""){
      elem.nextElementSibling.style.height = "0"
    }
  }
  Blurr (elem: any){
    elem.nextElementSibling.style.height = "0"
  }
}
