import { Router } from '@angular/router';
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

  constructor (private http: HttpClient, public auth: AuthService, private router: Router) {
    this.logincheck()
  }
  private loggedin = false
  ngOnInit () {
  }
  
  navigate(route: any) {
    this.router.navigate(route).then(() => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(route);
      });
    })
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
      'background': '#212529'

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


  // upload() {
  //   let file = this.base64ToFile(this.cropImgPreview, this.imgChangeEvt.target.files[0].name)
  //   console.log(file)
  //   const fd = new FormData()
  //   fd.append('img', file, file.name)
  //   this.http.post('http://localhost:8000/post/create/img/', fd)
  //     .subscribe(res => {
  //       console.log(res)
  //     })
  // }

}
