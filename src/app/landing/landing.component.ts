import { Component, Input, Inject } from '@angular/core';
import { WindowService } from '../window.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'toastr-ng2';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core"
declare var clevertap:any;

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
  @Input() bgcolor:string;

  private window: any;
  public position: any = {};
  public ctaText = '';
  public newsLetterEmail = '';

  constructor(private $window: WindowService, private service: AuthService, private toastrService: ToastrService, private translate: TranslateService,
  private router:Router) {
    this.window = $window.nativeWindow;
    setTimeout(function() {

      let ctaBtn =   document.querySelector('#\\30 > div > a');
      if(ctaBtn)
      ctaBtn.addEventListener("click",(e)=>{
          e.preventDefault();
          router.navigate(['/mixmatch'],{queryParams:{step:1}})
          return false;
        })
   
    }, (1000));
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
    if(this.newsLetterEmail.indexOf('@') < 0 || this.newsLetterEmail.indexOf('.') < 0) {

      this.translate.get("ERROR_EMAIL_INVALID").subscribe((res:string)=>{
        
                    this.toastrService.error(
                      res,
                      'Error!'
                    );
                  })

                  
     
      return false;
    }
    this.service.newsLetter(this.newsLetterEmail).subscribe(
      (data) => {
        this.translate.get("SUCCESS_NEWSLETTER_SUBSCRIBED").subscribe((res:string)=>{
          
                      this.toastrService.success(
                        res,
                        'Success!'
                      );
                    })

                    clevertap.event.push("news letter subscribed",this.newsLetterEmail);
                    
      }
    );
  }

}
