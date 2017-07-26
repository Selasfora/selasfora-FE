import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { FiltersService } from '../filters.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.less']
})
export class CatalogComponent implements OnInit {

  mode: string = 'grid';
  list: Array<object> = [];
  filters:object = {
    color: [],
    size: [],
    material: [],
    mood: [],
    sortBy: []
  };

  type: string = '';
  pageTitle: string = 'Selasfora ';
  subscriptions: Array<any> = [];

  constructor(public service: AuthService, public route: ActivatedRoute, private router: Router,
      public filterService: FiltersService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.route.paramMap
      .subscribe((data) => {
        this.type = data.get('type');

        if(this.type.toLowerCase() !== 'charm' && this.type.toLowerCase() !== 'bracelet') {
          this.router.navigate(['/404']);
          return;
        }

        if(this.type == 'charm') this.pageTitle = 'Selasfora Charms';
        if(this.type == 'bracelet') this.pageTitle = 'Selasfora Bracelets';

        let that = this;
        this.subscriptions.push(that.service.fetchProducts(this.type)
        .subscribe(
          (data) => {
            that.list = data;
          }
        ));

        this.subscriptions.push(that.service.fetchFilters().subscribe(
          (data) => {
            that.filters = data;
            that.filterService.filters.next(that.filters);
          }
        ));

        this.subscriptions.push(
          that.filterService.query.subscribe(
            (data) => {
              data && this.subscriptions.push(
                that.service.queryProducts(data + 'product_type=' + that.type).subscribe(
                  (data) => {
                    that.list = data.filter(function(item) {
                      return item.product_type == that.type;
                    });
                  }
                )
              );
            }
          )
        );
      }
    ));
  }

  parseResponse(data) {
    let that = this;
    data.forEach(function(product) {
      product.options.forEach(function(item) {
        let name = item.name.toLowerCase();
        let values = item.values;
        if(that.filters[name]) {
          that.filters[name] = that.arrayUnique(that.filters[name].concat(values));
        }
      });
    });
    that.filterService.filters.next(that.filters);
  }

  arrayUnique(array) {
    var a = array.concat();
    for(var i = 0; i < a.length; ++i) {
      for(var j = i + 1; j < a.length; ++j) {
        if(a[i] === a[j])
          a.splice(j--, 1);
      }
    }
    return a;
  }

  ngOnDesroy() {
    this.subscriptions.forEach(function(item) {
      item.unsubscribe();
    });
  }

}
