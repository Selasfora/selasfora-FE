import { Component, OnInit, Input,ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { FiltersService } from '../filters.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import {DynamicTranslationService} from '../dynamic-translation.service'

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.less']
})
export class CatalogComponent implements OnInit {
  public showFilter = false;
  @Input() mode = 'grid';
  @Input('showCollections') showCollections  = true;
  @Input('canAddToCart') canAddToCart = true;
  @Input('hideMainHeader') hideheader = false;
  @ViewChild('slideContainer') slideContainer:ElementRef;
  list: Array<object> = [];
  lists: Array<any> = [];
  private filterParams:string;
  private page:number;
  private requestRunning:boolean;
  collectionSelected:any = false;

  filters: object = {
    color: [],
    size: [],
    material: [],
    mood: [],
    sortBy: []
  };
  slideContainerWidth = 'auto';

  @Input() type = '';
  pageTitle = 'Selasfora ';
  subscriptions: Array<any> = [];

  //TODO make dynamic translation string for type and mode 

  constructor(public service: AuthService, private route: ActivatedRoute, private router: Router,
      public filterService: FiltersService, private slimLoadingBarService: SlimLoadingBarService,
      private dynamicTranslations: DynamicTranslationService,
      private changeDetector:ChangeDetectorRef) {
        console.log('constructor');
        this.page = 1;
        this.filterParams = null;
        this.requestRunning = false;

        if(this.type){
          this.fetchProducts(this.type,this.page,this.filterParams);
        }

      router.events.subscribe((events:any)=>{
     
        var d = router.parseUrl(events.url)
        this.showCollections = d.queryParams.hasOwnProperty('collection') || (d.queryParams.hasOwnProperty('collection') == false && events.url.indexOf("/catalog/charm") < 0) ? true : false;
        this.showFilter = this.showCollections;
        this.list = [];
        this.page =1;
      

      })
  }

  parseList(res:any[]) {

 
    let count = this.list.length;

    res.forEach((item:any, i)=> {
      
   
   
      
      /**ensure translations */
      let parser = new DOMParser();
      let translations = [
        item.title,
        parser.parseFromString(item.body_html,"text/html").querySelector('body').innerText

      ]
      this.dynamicTranslations.getTranslation(translations).subscribe(res=>{
        item.title = res[0][0] || "";
        item.body_html = res[0][1] || "";
        this.list.push(item);
      })
      
    });
  }

  ngOnInit() {
    this.startLoading();
    this.subscriptions.push(this.route.paramMap
      .subscribe((data) => {

        // set the page title according to the kind of product

        const t = data.get('type');
        if (t) {
          this.type = t;
          if (this.type.toLowerCase() !== 'charm' && this.type.toLowerCase() !== 'bracelet') {
            this.router.navigate(['/404']);
            return;
          }

          if (this.type === 'charm') {
            this.pageTitle = '';
          }

          if (this.type === 'bracelet') {
            this.pageTitle = 'Selasfora Bracelets';
          }
        }

        this.page = 1;
        this.fetchProducts(this.type,this.page,this.filterParams);

        this.subscriptions.push(this.service.fetchFilters().subscribe(
          (res) => {
            this.filters = res;
            this.filterService.filters.next(this.filters);
          }
        ));

        // if filters change .. reset the page to 1 and fetch products 
        this.subscriptions.push(
          this.filterService.query.subscribe(
            (d) => {
              this.filterParams = d || null;
              this.page = 1;
              this.fetchProducts(this.type,this.page,this.filterParams)
            }
          )
        );
      }
    ));
  }

  fetchProducts(type,page,d) {
  // make sure this only runs when not viewing collections 

    this.requestRunning = true;

    if (!this.type && this.showCollections)  {
      return ;
    }
    this.startLoading();
    if (!d || d === '?' || d==="?&") {
      this.subscriptions.push(this.service.fetchProducts(this.type,this.page)
      .subscribe(
        (res) => {
          this.completeLoading();
         
          this.parseList(res);
          this.resetContainer(false);
          this.requestRunning = false;
        }
      ));
    } else {
      const s = this.service.queryProducts(d + 'product_type=' + this.type + '&page='+this.page+'&limit=9').subscribe(
        (res) => {
          this.completeLoading();
          
          this.parseList(res);
          this.resetContainer(false)
          this.requestRunning = false;
        }
      );
      d && this.subscriptions.push(s);
    }
  }

  parseResponse(data) {

    data.forEach((product)=> {
      product.options.forEach((item)=> {
        const name = item.name.toLowerCase();
        const values = item.values;
        if (this.filters[name]) {
          this.filters[name] = this.arrayUnique(this.filters[name].concat(values));
        }
      });
    });
    this.filterService.filters.next(this.filters);
  }

  arrayUnique(array) {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }
    return a;
  }

  ngOnDesroy() {
    this.subscriptions.forEach((item) => {
      item.unsubscribe();
    });
  }

  startLoading() {
    this.slimLoadingBarService.start(() => {
      console.log('Loading complete');
    });
  }

  stopLoading() {
    this.slimLoadingBarService.stop();
  }

  completeLoading() {
    this.slimLoadingBarService.complete();
  }

  switchMode(e) {
    this.mode = this.mode === 'slide' ? 'grid' : 'slide';

    if (this.mode !== 'grid') {
      const l = 350;
      this.slideContainerWidth = this.list.length * l + 200 + 'px';
      window.scrollTo(0,0);
    } else {
      this.slideContainerWidth = 'auto';
    }
  
    e.preventDefault();
    this.setUpScrolling();
    return false;
  }

  gotoMixMatch(){
    this.router.navigate(["/mixmatch"],{queryParams:{step:3}})
  }

  resetContainer(resetScroll){
    if (this.mode !== 'grid') {
      const l = 350;
      this.slideContainerWidth = this.list.length * l + 200 + 'px';
      if(resetScroll)
      window.scrollTo(0,0)
    } else {
      this.slideContainerWidth = 'auto';
    }
    this.setUpScrolling();
  }

  setUpScrolling(){
    switch(this.mode == 'grid'){
      case true:{
        // track the window's vertical scrolling 
        this.slideContainer.nativeElement.onscroll = null;
        window.onscroll = (e)=>{
          if(!this.requestRunning)
          if (document.scrollingElement.scrollHeight - 100 <= 
            document.scrollingElement.scrollTop +        
            window.innerHeight) {
            this.page +=1;
            this.fetchProducts(this.type,this.page,this.filterParams)
        }
        }
        
        break;
      }
      case false:{
        window.onscroll = null;
        this.slideContainer.nativeElement.onscroll = (e)=>{
          if(!this.requestRunning)
          if(this.slideContainer.nativeElement.scrollLeft + this.slideContainer.nativeElement.offsetWidth >= this.slideContainer.nativeElement.scrollWidth -100 ) {
            this.page+=1;
            this.fetchProducts(this.type,this.page,this.filterParams)
        }
        }
        break;
      }
    }
  }

}
