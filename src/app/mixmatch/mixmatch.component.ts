import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-mixmatch',
  templateUrl: './mixmatch.component.html',
  styleUrls: ['./mixmatch.component.less']
})
export class MixmatchComponent implements OnInit {
  url = '/assets/images/mixmatch/charm';
  emptyCharms = [this.url + 1 + '.png', this.url + 2 + '.png', this.url + 3 + '.png'];
  usedCharms = [];
  highlightStore = false;
  checkoutUrl = '';
  step = 1;

  constructor(private dragula: DragulaService, public route: ActivatedRoute, private router: Router,
    public _cart: CartService) {
    this.dragula.setOptions('bag-charms', {});
    _cart.getCart().subscribe(
      data => console.log('from mixmatch', data)
    )

      _cart.getCheckoutUrl().subscribe(
      (data) => {
        this.checkoutUrl = data;
      }
    );

  }

  ngOnInit() {
    this.dragula
      .drag
      .subscribe(value => {
        this.highlightStore = true;
      });

    this.dragula
      .drop
      .subscribe(value => {
        //console.log('drop', this.emptyCharms, this.usedCharms);
      });

    this.dragula
      .out
      .subscribe(value => {
        //console.log('out', value);
      });

    this.dragula
      .remove
      .subscribe(value => {
        //console.log('remove', this.emptyCharms, this.usedCharms);
      });

    this.dragula
      .dragend
      .subscribe(value => {
        //console.log('dragend', this.emptyCharms, this.usedCharms);
        this.highlightStore = false;
      });

    this.route.queryParams
      .subscribe((data) => {
        const s = parseInt(data.step, 10);
        this.step = !s || s > 3 || s < 1 ? 1 : s;
      }
      );
  }


}
