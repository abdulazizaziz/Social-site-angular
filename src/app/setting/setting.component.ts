import  Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { UsernameValidators } from './username.validators';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  constructor(private auth: AuthService, private http: HttpClient) { }
  value = 'Clear'
  ngOnInit(): void {
    this.http.get('http://localhost:8000/api/edit/' + this.auth.user.user_id + '/')
    .subscribe(res => {
      this.user = res
      console.log(this.user['country'])
      this.form.setValue({
        name: this.user.name,
        username: this.user.username,
        country: this.user.country,
        live_country: this.user.live_country,
        live_city: this.user.live_city,
        about: this.user.about,
        birth: this.user.birth,
        number: '0' + this.user.number,
        education: this.user.education,
      })

    })
  }
  user: any
  cropper: boolean = false
  img: any
  file: any
  detail: any  

  imgChangeEvt: any = '';
  cropImgPreview: any = '';

  onFileChange(event: any): void {
    if (event.target.value) {
      this.imgChangeEvt = event;
      this.cropper = true
    }
  }
  cropImg(e: ImageCroppedEvent) {
      this.cropImgPreview = e.base64;
  }

  selectimg (image: any) {
    let file = this.base64ToFile(this.cropImgPreview, this.imgChangeEvt.target.files[0].name)
    let data = new FormData()
    data.append('img', file, file.name)
    this.file = file
    this.user.img = this.cropImgPreview
    this.cropper = false
  }
  base64ToFile(data: any, filename: any) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  closecropper (image: any) {
    image.value = ''
    this.cropper = false
  }
  imgLoad ( ) { }
  initCropper ( ) { }
  imgFailed ( ) { }


  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ], UsernameValidators.usernameuniqe),
    country: new FormControl(),
    live_country: new FormControl(),
    live_city: new FormControl('',[
      Validators.required,
      Validators.minLength(3)
    ]),
    education: new FormControl('', [
      Validators.required
    ]),
    number: new FormControl('',[
      Validators.required,
      UsernameValidators.number
    ]),
    birth: new FormControl(),
    about: new FormControl()
  })

  get name () {
    return this.form.get('name')
  }
  get username () {
    return this.form.get('username')
  }
  get city () {
    return this.form.get('live_city')
  }
  get education () {
    return this.form.get('education')
  }
  get number () {
    return this.form.get('number')
  }

  submit () {
    console.log(this.form.value)
    Swal.fire({
      'icon': 'success',
      'text': 'Updated Successfully',
      'confirmButtonColor': '#a5dc86',
    })
  }

}
