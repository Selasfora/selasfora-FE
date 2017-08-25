import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-size-guide',
  templateUrl: './size-guide.component.html',
  styleUrls: ['./size-guide.component.less']
})

export class SizeGuideComponent implements OnInit {
  menuHidden = true;

  @Input() menuStatus;
  @Output() closeMenu = new EventEmitter();

  constructor(private userService: UserService, private authService: AuthService
    , private router: Router) {
  }

  ngOnInit() {
  }

  empty() {
    //just a place holder
    return false;
  }

  close() {
    this.menuStatus = false;
    this.closeMenu.emit(false);
  }
}
