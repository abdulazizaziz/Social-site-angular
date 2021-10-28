import { Router } from '@angular/router';
// import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import 'rxjs/add/operator/map'
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  UsernameCheck (username: any) {
    let data = {
      "username": username
    }
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

  currentUser(){
    return this.http.get('http://localhost:8000/api/showuser/' + this.user.username + '/')
  }

  userdetail(username: any) {
    return this.http.get('http://localhost:8000/api/showuser/' + username + '/')
  }



  //  Post https
  // Start

  posts: any
  allposts() {
    let imgs: any
    let posts: any
    return this.http.get('http://localhost:8000/post/' + this.user.user_id + '/')
    .map(res => {
      if (res) {
        posts = res
        this.http.get('http://localhost:8000/post/imgs/')
        .subscribe(response => {
          imgs = response
          for (let i=0; i < posts.length ; i++) {
            posts[i].imgs = Array()
            for (let j=0 ; j < imgs.length ; j++) {
              if (posts[i].id == imgs[j].post) {
                posts[i].imgs.splice(0 ,0 ,imgs[j].img)
              }
            }
          }
        })
        this.posts = posts
        return posts
      }
      return false
    })
  }

  someposts(username: any) {
    let imgs: any
    let posts: any
    return this.http.get('http://localhost:8000/post/some/' + username + '/')
    .map(res => {
      if (res) {
        posts = res
        this.http.get('http://localhost:8000/post/imgs/')
        .subscribe(response => {
          imgs = response
          for (let i=0; i < posts.length ; i++) {
            posts[i].imgs = Array()
            for (let j=0 ; j < imgs.length ; j++) {
              if (posts[i].id == imgs[j].post) {
                posts[i].imgs.splice(0 ,0 ,imgs[j].img)
              }
            }
          }
        })
        this.posts = posts
        return posts
      }
      return false
    })
  }

  savedpost() {
    let imgs: any
    let posts: any
    return this.http.get('http://localhost:8000/post/savedpost/' + this.user.user_id + '/')
    .map(res => {
      if (res) {
        posts = res
        this.http.get('http://localhost:8000/post/imgs/')
        .subscribe(response => {
          imgs = response
          for (let i=0; i < posts.length ; i++) {
            posts[i].imgs = Array()
            for (let j=0 ; j < imgs.length ; j++) {
              if (posts[i].id == imgs[j].post) {
                posts[i].imgs.splice(0 ,0 ,imgs[j].img)
              }
            }
          }
        })
        this.posts = posts
        return posts
      }
      return false
    })
  }


  navigate(route: any) {
    // console.log(route)
    this.router.navigate(route).then(() => {
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate(route);
      });
    })
  }
}