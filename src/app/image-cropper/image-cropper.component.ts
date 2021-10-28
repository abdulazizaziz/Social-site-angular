import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.css']
})
export class ImageCropperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  imgChangeEvt: any = '';
  cropImgPreview: any = '';
  url: any = ""

  onFileChange(event: any, hide: any): void {
    this.imgChangeEvt = event;
    hide.style.display = 'none'
    // console.log(event.target.files[0])
  }
  cropImg(e: ImageCroppedEvent) {
      this.cropImgPreview = e.base64;
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

  imgLoad(event: any) {
    // display cropper tool
    // console.log(event)
  }
  
  initCropper(event: any) {
      // init cropper
  }
  
  imgFailed() {
      // error msg
  }


}
