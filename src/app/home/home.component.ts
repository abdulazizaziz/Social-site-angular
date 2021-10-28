import { PostComponent } from './../post/post.component';
import { AuthService } from './../auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit(): void {
  }


  upload (text: any) {

      var data = new FormData()
      data.append('article', text.value)
      data.append('user', this.auth.user.user_id)

      // Creating Post
      this.http.post('http://localhost:8000/post/create/', data)
      .subscribe(postRes => {
        let post = <any>postRes

        //  Getting Post with user data
        this.http.get('http://localhost:8000/post/getpost/' + post.id + '/')
        .subscribe(getpostRes => {
          post = <any>getpostRes


          // Loop of photo that how much selected
          let postimgs: any[] = []
          for (let i=0; i<=this.files.length; i++) {

            if(i!=this.files.length){
              var fd = new FormData()
              fd.append('post', post.id)
              fd.append('img', this.files[i], this.files[i].name)
              
              //  Creating Post Photo as loop of its size
              this.http.post('http://localhost:8000/post/createimgs/', fd)
              .subscribe(response => {
                var img = <any>response
                postimgs.splice(0,0, img.img)
              })
            }else if(i==this.files.length){
              post.imgs = postimgs
              this.auth.posts.splice(0, 0, post)
              this.files = []
              this.imgs = []
              text.value = ''
            }

          }
        })
      })
      // Post Created 
}




  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  imgs: any = []
  files: any = []

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
    this.files.splice(this.files.length, 0, file)
    this.imgs.splice(this.imgs.length, 0, this.cropImgPreview)
    this.cropper = false
    // image.value = ''
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
  cropper: boolean = false
  closecropper (image: any) {
    image.value = ''
    this.cropper = false
  }
  imgLoad ( ) { }
  initCropper ( ) { }
  imgFailed ( ) { }
}
