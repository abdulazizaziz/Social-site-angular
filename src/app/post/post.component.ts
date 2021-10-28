import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
 @Input('profile') profile: any
 @Input('saved') saved: any
  constructor(public auth: AuthService, private http: HttpClient, private route: ActivatedRoute) { }
  ngOnInit () {
    this.route.paramMap.subscribe(map => {
      this.username = <string>map.get('username')
    })

    if(this.profile){
      this.auth.someposts(this.profile)
      .subscribe(response => {
        this.posts = response
      })
    }
    if (this.saved) {
      this.auth.savedpost()
      .subscribe(res => {
        this.posts = res
      })
    }
    this.auth.allposts()
    .subscribe(res => {
      if ( res )
      this.wrong = false
      else 
      this.wrong = true
    })
    
  }
  posts: any[]
  wrong: boolean = false
  username: string
  comments: any[]
  commentPost: any
  iseditcomment: boolean = false
  editpost: any

  Editpost (post: any) {
    this.editpost = post
  }
  updatepost (article: any) {
    let data = new FormData()
    data.append('article', article.value)

    this.http.post('http://localhost:8000/post/update/' + this.editpost.id + '/', data)
    .subscribe(res => {
      if (!this.profile && !this.saved) {
        let index = this.auth.posts.indexOf(this.editpost)
        let post: any = res
        this.auth.posts[index].article = post?.article
      }else if (this.profile || this.saved) {
        let index = this.posts.indexOf(this.editpost)
        let post: any = res
        this.posts[index].article = post?.article
      }
    })
  }

  edit(comment: any) {
    let commentbox = comment.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement
    let editbox = commentbox.querySelector('.edit')
    let text = commentbox.querySelector('.text')
    editbox.style.display = 'block'
    text.style.display = 'none'
  }

  updated(comment: any, edittext: any) {
    let data = new FormData()
    data.append('comment', edittext.value)
    this.http.post('http://localhost:8000/post/editcomment/' + comment.id + '/', data)
    .subscribe(res => {
      let index = this.comments.indexOf(comment)
      this.comments[index] = res
      this.iseditcomment = false
    })
  }

  like(post: any) {
    if (!post.postlikes.includes(this.auth?.user?.user_id)) {
      this.http.get('http://localhost:8000/post/addlike/' + this.auth.user.user_id + '/' + post.id + '/')
      .subscribe(res => {
        post.postlikes.splice(0, 0, this.auth.user.user_id)
      })
    }else if (post.postlikes.includes(this.auth?.user?.user_id)) {
      this.http.get('http://localhost:8000/post/removelike/' + this.auth.user.user_id + '/' + post.id + '/')
      .subscribe(res => {
        let index = post.postlikes.indexOf(this.auth.user.user_id)
        post.postlikes.splice(index, 1)
      })
    }
  }

  save (post: any) {
    if (!post.postsaved.includes(this.auth?.user?.user_id)) {
      this.http.get('http://localhost:8000/post/addsaved/' + this.auth.user.user_id + '/' + post.id + '/')
      .subscribe(res => {
        post.postsaved.splice(0, 0, this.auth.user.user_id)

        if (this.saved) {
          this.posts.splice(0, 0, post)
        }
      })
    }else if (post.postsaved.includes(this.auth?.user?.user_id)) {
      this.http.get('http://localhost:8000/post/removesaved/' + this.auth.user.user_id + '/' + post.id + '/')
      .subscribe(res => {
        let index = post.postsaved.indexOf(this.auth.user.user_id)
        post.postsaved.splice(index, 1)

        if (this.saved) {
          let index = this.posts.indexOf(post)
          this.posts.splice(index, 1)
        }

      })
    }
  }

  Dblock (event: any) {
    event.target.nextElementSibling.classList.toggle('d-block')
  }

  deletepost (post: any, id: any) {
    this.http.get('http://localhost:8000/post/delete/' + id + '/')
    .subscribe(res => {
      if (this.profile || this.saved) {
        let index = this.posts.indexOf(post)
        this.posts.splice(index, 1)
      }
      else if (!this.profile && !this.saved) {
        let index = this.auth.posts.indexOf(post)
        this.auth.posts.splice(index, 1)
      }
    })
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

  openModel(post: any){
    this.comments = post.comment
    this.commentPost = post
  }
  log (comment: any) {
    if (comment.value) {
      
    }
  }
  addcomment(comment: any) {
    let data = new FormData()
    data.append('user', this.auth.user.user_id)
    data.append('post', this.commentPost.id)
    data.append('comment', comment.value)
    this.http.post('http://localhost:8000/post/addcomment', data)
    .subscribe(res => {
      if (!this.profile && !this.saved) {
        let index = this.auth.posts.indexOf(this.commentPost)
        this.auth.posts[index].comment.splice(0, 0, res)
        comment.value = ''
      }
      else if (this.profile || this.saved){
        let index = this.posts.indexOf(this.commentPost)
        this.posts[index].comment.splice(0, 0, res)
        comment.value = ''
      }
    })
  }
  deletecomment(comment: any) {
    this.http.get('http://localhost:8000/post/deletecomment/' + comment.id + '/')
    .subscribe(res => {
      var index = this.comments.indexOf(comment)
      // this.comments.splice(index, 1)

      if (!this.profile && !this.saved) {
        let Index = this.auth.posts.indexOf(this.commentPost)
        this.auth.posts[Index].comment.splice(index, 1)
      }
      else if (this.profile || this.saved) {
        let Index = this.posts.indexOf(this.commentPost)
        this.posts[Index].comment.splice(index, 1)
      }
    })
  }

  left (elem: any) {
    let imgs = elem.target.parentElement.parentElement.querySelectorAll('.img')
    let number = imgs[0].style.transform.slice(11)
    let index
    if (number.includes('p'))
      index = number.indexOf('p')
    else if (number.includes('%'))
      index = number.indexOf('%')
    number = number.slice(0, index)
    number = <number>number
    if (number < 0){
      number = Number(number) + 100 
    }
    for (let i=0; i<imgs.length; i++) {
      imgs[i].style.transform = `translateX(${number}%)`
    }

    if (number == 0) {
      elem.target.style.display = 'none'
    }
    elem.target.nextElementSibling.style.display = 'block'

    let active = elem.target.parentElement.parentElement.querySelector('.active')
    active.previousElementSibling.classList.add('active')
    active.classList.remove('active')
  }



  right (elem: any) {
    let imgs = elem.target.parentElement.parentElement.querySelectorAll('.img')
    let number = imgs[0].style.transform.slice(11)
    let index
    if (number.includes('p'))
      index = number.indexOf('p')
    else if (number.includes('%'))
      index = number.indexOf('%')
    number = number.slice(0, index)
    number = <number>number
    let lesnum = imgs.length
    lesnum = (lesnum * 100) - 100
    lesnum = <string>lesnum
    if (number == 0)
      number = -0
    if (number != `-${lesnum}`) {
      number = Number(number) - 100 
    }
    for (let i=0; i<imgs.length; i++) {
      imgs[i].style.transform = `translateX(${number}%)`
    }
    if (number == `-${lesnum}`) {
        elem.target.style.display = 'none'
    }
    elem.target.previousElementSibling.style.display = 'block'

    let active = elem.target.parentElement.parentElement.querySelector('.active')
    active.nextElementSibling.classList.add('active')
    active.classList.remove('active')
  }

  changeimg(elem: any, index: any) {
    let count = elem.target.parentElement.querySelector('.active')
    count.classList.remove('active')
    elem.target.classList.add('active')
    let number: any = index * 100
    number = <string>'-'+number
    if (number == -0){
      number = 0
    }

    let imgs = elem.target.parentElement.parentElement.querySelectorAll('.img')
    for (let i=0; i<imgs.length; i++) {
      imgs[i].style.transform = `translateX(${number}%)`
    }
    let left = elem.target.parentElement.parentElement.querySelector('.left')
    let right = elem.target.parentElement.parentElement.querySelector('.right')

    let lesnum = imgs.length
    lesnum = (lesnum * 100) - 100
    lesnum = <string>lesnum
    // console.log(number, `-${lesnum}`)
    // console.log(right)
    if (number == `-${lesnum}`) {
      right.style.display = 'none'
      left.style.display = 'block'
    }else{
      right.style.display = 'block'
    }
    if (number == 0) {
      left.style.display = 'none'
      right.style.display = 'block'
    }else{
      left.style.display = 'block'
    }
  }
}
