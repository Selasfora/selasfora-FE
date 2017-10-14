import { Component, OnInit, Input } from '@angular/core';
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

  @Input() mode = 'grid';
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
      public filterService: FiltersService, private slimLoadingBarService: SlimLoadingBarService) {
        console.log('constructor');
      const that = this;
      const interval = setInterval(function() {
        if (that.type) {
          clearInterval(interval);
          that.fetchProducts();
        }
      }, 1000);

    

      router.events.subscribe((events:any)=>{
     
        var d = router.parseUrl(events.url)
        this.collectionSelected = d.queryParams.hasOwnProperty('collection') ? d.queryParams.collection : '';
      })
  }

  parseList() {
    this.lists = [];
    let dev = 3;
    if (this.type === 'bracelet') {
      dev = 2;
    }
    let count = 0;
    const that = this;
    this.list.forEach(function(item, i) {
      if (i && i % dev === 0) {
        count++;
      }
      that.lists[count] = that.lists[count] || [];
      that.lists[count].push(item);
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

        const that = this;
        this.fetchProducts();

        this.subscriptions.push(that.service.fetchFilters().subscribe(
          (res) => {
            that.filters = res;
            that.filterService.filters.next(that.filters);
          }
        ));

        this.subscriptions.push(
          that.filterService.query.subscribe(
            (d) => {
              that.startLoading();
              if (!d || d === '?') {
                this.subscriptions.push(that.service.fetchProducts(this.type)
                .subscribe(
                  (res) => {
                    this.completeLoading();
                    that.list = res;
                    that.parseList();
                  }
                ));
              } else {
                const s = that.service.queryProducts(d + 'product_type=' + that.type).subscribe(
                  (res) => {
                    that.completeLoading();
                    that.list = res;
                    that.parseList();
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
    const that = this;
    if (!this.type) {
      return ;
    }
    console.log('fetching', this.type)
    this.subscriptions.push(
      that.service.fetchProducts(this.type)
      .subscribe(
        (res) => {
          this.completeLoading();
          that.list = res;
          that.parseList();
          if (this.mode !== 'grid') {
            const l = 350;
            this.slideContainerWidth = this.list.length * l + 200 + 'px';
          } else {
            this.slideContainerWidth = 'auto';
          }
        }
      )
    );
  }

  parseResponse(data) {
    const that = this;
    data.forEach(function(product) {
      product.options.forEach(function(item) {
        const name = item.name.toLowerCase();
        const values = item.values;
        if (that.filters[name]) {
          that.filters[name] = that.arrayUnique(that.filters[name].concat(values));
        }
      });
    });
    that.filterService.filters.next(that.filters);
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
    this.subscriptions.forEach(function(item) {
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
    } else {
      this.slideContainerWidth = 'auto';
    }

    e.preventDefault();
    return false;
  }

}
