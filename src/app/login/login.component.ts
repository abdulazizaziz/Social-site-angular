import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  signup: boolean = false

  signType () {
    this.signup = !this.signup
  }
  focuss (elem: any) {
    elem.nextElementSibling.style.height = "36px"
    // elem.nextElementSibling.style.marginBottom = "0"
  }
  blurr (elem: any){
    if(elem.value == ""){
      elem.nextElementSibling.style.height = "0"
      // elem.nextElementSibling.style.marginBottom = "34px"
    }
  }

  Blurr (elem: any){
    elem.nextElementSibling.style.height = "0"
  }
}
