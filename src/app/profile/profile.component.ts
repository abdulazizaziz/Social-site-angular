import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(public auth: AuthService,private http: HttpClient, public  route: ActivatedRoute, private router: Router) {
    this.profile = null
  }
  ngOnInit () {
    this.loader = true
    this.starter()
    this.getuser()
  }
  changeurl (model: any, username: any) {
    model.classList.remove('show')
    model.style.display = 'none!important'
    let body = document.body
    body.classList.remove('modal-open')
    body.style.overflow = ''
    body.style.paddingRight = ''

    let other = document.querySelector('.modal-backdrop')
    other?.remove()

    this.auth.navigate([username])
  }
  currrentUser: any
  getuser () {
    this.auth.currentUser()
    .subscribe(res => {
      this.currrentUser = res
    })
  }

  follow () {
    if (!this.currrentUser.following.includes(this.profile.id)) {
      this.http.get('http://localhost:8000/api/addfollow/' + this.user_id + '/' + this.profile.id + '/')
      .subscribe(res => {
        if(res){
          this.currrentUser.following.unshift(this.profile.id)
          this.followers.unshift(this.profile.id)
        }
      })
    }else if (this.currrentUser.following.includes(this.profile.id)) {
      this.http.get('http://localhost:8000/api/removefollow/' + this.user_id + '/' + this.profile.id + '/')
      .subscribe(res => {
        if (res) {
          let index
          index = this.currrentUser.following.indexOf(this.profile.id)
          this.currrentUser.following.splice(index, 1)
          index = this.followers.indexOf(this.profile.id)
          this.followers.splice(index, 1)
        }
      })
    }
  }

  following: any[]
  followers: any[]

  posts: any
  username: string
  user_id = this.auth.user.user_id
  profile: any
  loader: boolean = false
  profileimg: any
  starter () {
    this.profile = null
    this.route.paramMap.subscribe(map => {
      this.username = <string>map.get('username')
    })
    this.auth.userdetail(this.username)
    .subscribe(res => {
      this.profile = res
      this.profileimg = `http://localhost:8000${this.profile.img}`
      this.http.get('http://localhost:8000/api/getfollowing/'+ this.profile.id +'/')
      .subscribe(res => {
        this.following = <any>res
      })
      this.http.get('http://localhost:8000/api/getfollower/'+ this.profile.id +'/')
      .subscribe(res => {
        this.followers = <any>res
      })
      this.loader = false

    }, error => this.router.navigate(['']))
  }

  get profileuser(){
    let profile = <any>this.profile
    return profile.username
  }
}
