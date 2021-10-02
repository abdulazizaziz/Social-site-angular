import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor (private http: HttpClient, public auth: AuthService) {
    this.logincheck()
  }
  private loggedin = false
  ngOnInit () {
  }
  login () {
    this.loggedin = true
  }
  logout () {
    Swal.fire({
      'title': 'Do you want to Logout?',
      'icon': 'question',
      'showCancelButton': true,
      'cancelButtonText': "No",
      'confirmButtonText': "Yes",

    }).then(result => {
      if (result.value){
        this.auth.Logout()
        this.loggedin = false
      }
    })
  }
  logincheck() {
    if (this.auth.logincheck()) {
      this.loggedin = true
    }else {
      this.loggedin = false
    }
  }
  get Login () {
    return this.loggedin
  }
}
