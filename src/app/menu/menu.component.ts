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
    this.isLoggedIn = userService.isLoggedIn();
  }

  ngOnInit() {
  }

  close() {
    this.menuHidden = true;
    this.closeMenu.emit(true);
  }

  logout() {
    console.log('removing user')
    this.userService.removeUser();
    this.authService.logout(null).subscribe().unsubscribe();
    return false;
  }
}
