import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {
  menuHidden = true;

  @Input() menuStatus;
  @Output() closeMenu = new EventEmitter();

  isLoggedIn: boolean;
  user: any;

  constructor(private userService: UserService, private authService: AuthService) {
    this.user = userService.getUser();
    if(this.user) {
      this.user.name = this.user.name ||
        (this.user.first_name + ' ' + this.user.last_name) || this.user.email;
    }
    this.isLoggedIn = userService.isLoggedIn();
  }

  ngOnInit() {
  }

  empty() {
    //just a place holder
    return false;
  }

  close() {
    this.menuHidden = true;
    this.closeMenu.emit(true);
  }

  logout() {
    this.userService.removeUser();
    this.isLoggedIn = false;
    this.user = null;
    this.authService.logout(null).subscribe().unsubscribe();
    return false;
  }
}
