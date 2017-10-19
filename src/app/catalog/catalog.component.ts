import { Component, OnInit, Input,ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { FiltersService } from '../filters.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

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
  list: Array<object> = [];
  lists: Array<any> = [];
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

  constructor(public service: AuthService, private route: ActivatedRoute, private router: Router,
      public filterService: FiltersService, private slimLoadingBarService: SlimLoadingBarService,
      private changeDetector:ChangeDetectorRef) {
        console.log('constructor');
      this;
      const interval = setInterval(()=>{
        if (this.type) {
          clearInterval(interval);
          this.fetchProducts();
        }
      }, 1000);

    

      router.events.subscribe((events:any)=>{
     
        var d = router.parseUrl(events.url)
        this.showCollections = d.queryParams.hasOwnProperty('collection') || (d.queryParams.hasOwnProperty('collection') == false && events.url.indexOf("/catalog/charm") < 0) ? true : false;
        this.showFilter = this.showCollections;

      })
  }

  parseList() {
    this.lists = [];
    let dev = 3;
    if (this.type === 'bracelet') {
      dev = 2;
    }
    let count = 0;
    this;
    this.list.forEach((item, i)=> {
      if (i && i % dev === 0) {
        count++;
      }
      this.lists[count] = this.lists[count] || [];
      this.lists[count].push(item);
    });
  }

  ngOnInit() {
    this.startLoading();
    this.subscriptions.push(this.route.paramMap
      .subscribe((data) => {
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

       
        this.fetchProducts();

        this.subscriptions.push(this.service.fetchFilters().subscribe(
          (res) => {
            this.filters = res;
            this.filterService.filters.next(this.filters);
          }
        ));

        this.subscriptions.push(
          this.filterService.query.subscribe(
            (d) => {
              this.startLoading();
              if (!d || d === '?') {
                this.subscriptions.push(this.service.fetchProducts(this.type)
                .subscribe(
                  (res) => {
                    this.completeLoading();
                    this.list = res;
                    this.parseList();
                  }
                ));
              } else {
                const s = this.service.queryProducts(d + 'product_type=' + this.type).subscribe(
                  (res) => {
                    this.completeLoading();
                    this.list = res;
                    this.parseList();
                  }
                );
                d && this.subscriptions.push(s);
              }
            }
          )
        );
      }
    ));
  }

  fetchProducts() {
  
    if (!this.type) {
      return ;
    }
    console.log('fetching', this.type)
    this.subscriptions.push(
      this.service.fetchProducts(this.type)
      .subscribe(
        (res) => {
          this.completeLoading();
          this.list = res;
          this.parseList();
          if (this.mode !== 'grid') {
            const l = 350;
            this.slideContainerWidth = this.list.length * l + 200 + 'px';
            window.scrollTo(0,0)
          } else {
            this.slideContainerWidth = 'auto';
          }
        }
      )
    );
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
    return false;
  }

  gotoMixMatch(){
    this.router.navigate(["/mixmatch"],{queryParams:{step:3}})
  }

}
