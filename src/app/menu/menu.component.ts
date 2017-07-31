import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';

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
  checkoutUrl: string = '';
  cartCount: any;

  constructor(private userService: UserService, private authService: AuthService
    , private router: Router, private _cart: CartService) {
    this.user = userService.getUser();
    if(this.user) {
      this.user.name = this.user.name ||
        (this.user.first_name + ' ' + this.user.last_name) || this.user.email;
    }
    this.isLoggedIn = userService.isLoggedIn();

    _cart.getCheckoutUrl().subscribe(
      (data) => {
        this.checkoutUrl = data;
      }
    );

    _cart.getCartCount().subscribe(
      (data) => {
        console.log('cart count', data)
        this.cartCount = data;
      }
    );
  }

  ngOnInit() {
  }

  empty() {
    //just a place holder
    return false;
  }

  login() {
    this.menuHidden = true;
    this.closeMenu.emit(true);
    this.router.navigate(['/login']);
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
