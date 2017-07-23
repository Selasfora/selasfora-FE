import { Component, Input, Inject } from '@angular/core';
import { WindowService } from '../window.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'toastr-ng2';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})

export class LandingComponent {

  @Input() page: any = {
    colorShade: 'dark',
    imagePath: ''
  };

  @Input() idx: any;
  @Input() last: any;

  private window: any;
  public position: any = {};
  public ctaText = '';
  public newsLetterEmail = '';

  constructor(private $window: WindowService, private service: AuthService, private toastrService: ToastrService) {
    this.window = $window.nativeWindow;
  }

  ngOnChanges() {
    this.position[this.page.position] = '60px';
  }

  follow(type) {
    if(type == 'insta') {
      console.log('insta clicked');
    }
  }

  newsLetter() {
    console.log(1, this.newsLetterEmail)
    this.service.newsLetter(this.newsLetterEmail).subscribe(
      (data) => {
        console.log('success', data)
        this.toastrService.success('Thank you!', 'You are now subscribed to our newsletter!');
      }
    );
  }

}
