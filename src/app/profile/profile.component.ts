import { AuthService } from './../auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  constructor(public auth: AuthService, public  route: ActivatedRoute) { }
  username: string
  user_id = this.auth.user.user_id
  profile: any
  ngOnInit () {
    this.route.paramMap.subscribe(map => {
      this.username = <string>map.get('username')
    })



    this.auth.userdetail(this.user_id)
    .subscribe(res => {
      console.log(res)
      this.profile = res
    })
    console.log(this.user_id)
  }

}
