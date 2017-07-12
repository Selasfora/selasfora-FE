import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
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
  type: string = '';
  pageTitle: string = 'Selasfora ';

  constructor(public service: AuthService, public route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe((data) => {
        this.type = data.get('type');

        if(this.type.toLowerCase() !== 'charm' && this.type.toLowerCase() !== 'bracelet') {
          this.router.navigate(['/404']);
          return;
        }

        if(this.type == 'charm') this.pageTitle = 'Selasfora Charms';
        if(this.type == 'bracelet') this.pageTitle = 'Selasfora Bracelets';

        let that = this;
        that.service.fetchProduct(this.type)
        .subscribe(
          (data) => {
            that.list = data;
          }
        );
      }
    );
  }

}
