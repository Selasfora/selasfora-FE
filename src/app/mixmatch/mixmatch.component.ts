import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../cart.service';
declare var window;
@Component({
  selector: 'app-mixmatch',
  templateUrl: './mixmatch.component.html',
  styleUrls: ['./mixmatch.component.less']
})
export class MixmatchComponent implements OnInit {
  url = '/assets/images/mixmatch/charm';
  emptyCharms = [this.url + 1 + '.png', this.url + 2 + '.png', this.url + 3 + '.png'];
  usedCharms1 = [];
  usedCharms2 = [];
  usedCharms3 = [];
  bracelet = {};
  errorMessage = null;
  highlightStore = false;
  checkoutUrl = '';
  step = 1;

  constructor(private dragula: DragulaService, public route: ActivatedRoute, private router: Router,
    private detector : ChangeDetectorRef,
    public _cart: CartService) {
    this.dragula.setOptions('bag-charms', {});

    // clear the local storage when the cart is loaded

    // clear local storage and the cart as well
    let selected_items = JSON.parse(localStorage.getItem('selected_items') || '[]');

    /*window.addEventListener('beforeunload',()=>{
        localStorage.setItem("selected_items",'[]');
    })*/

    _cart.getCheckoutUrl().subscribe(
      (data) => {
        this.checkoutUrl = data;
      }
    );

    // show page 3 if there is already data
    let data =  JSON.parse(localStorage.getItem('selected_items')) || [];
    if(data.length)
    router.navigate(["/mixmatch"],{queryParams:{step:3}})

  }

  ngOnDestroy() {
    localStorage.setItem("selected_items",'[]');
    this.dragula.destroy('bag-charms');
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
       // console.log('drop', this.emptyCharms, this.usedCharms);
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
       // console.log('dragend', this.emptyCharms, this.usedCharms);
        this.highlightStore = false;
      });

    this.route.queryParams
      .subscribe((data) => {
        const s = parseInt(data.step, 10);
        this.step = !s || s > 3 || s < 1 ? 1 : s;

        // if step 3 , load all the charms 
        if (this.step == 3) {
          let data =  JSON.parse(localStorage.getItem('selected_items'))
          let selected_charms = data.filter(i => i.type == "charm");
          this.emptyCharms = selected_charms;

          // get the bracelet 
          let bImg = data.find(i => i.type == "bracelet") ? data.find(i => i.type == "bracelet").img[1].src : null;
          this.bracelet =` url(${bImg} )  no-repeat center`;

          if(!selected_charms.length && !bImg){
            this.errorMessage = "You have not selected any bracelet and charms. You can come here again after making a selection."
          }

          if(!selected_charms.length){
            this.errorMessage = "You have not selected any  charms. You can come here again after making a selection."
          }

          if(!bImg){
             this.errorMessage = "You have not selected a bracelet. You can come here again after making a selection."
          }

          if(bImg && selected_charms.length){
            this.errorMessage = null;
          }

          this.detector.detectChanges();
        }

      }
      );
  }

  checkout(){

    // add existing items to cart and checkout 
    let selected_items = JSON.parse(localStorage.getItem('selected_items'));
  
  
    Promise.all(
    selected_items.map(item=>{
     return this._cart.addToCart({variant: item.cartItem.variants[0], quantity: 1});
    })
    ).then((done:any)=>{
       window.location.href = done[0].checkoutUrl;
    })

   
  }


}
