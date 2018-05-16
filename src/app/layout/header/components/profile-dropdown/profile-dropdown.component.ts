import { Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropdownComponent implements OnInit, OnChanges {
  @Input() isAuthenticated;
  email = '';
  currentUser: any;
  subnav: boolean;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.currentUser = JSON.parse(localStorage.getItem('user'))
    if (this.currentUser) {
      this.email = this.currentUser.email.split('@')[0];
    }
  }

  logout() {

    this.subnav = !this.subnav;
    this.authService.logout().
      subscribe(data => console.log(data));
  }

  login() {
    this.router.navigate(['/auth/login'])
  }

}
