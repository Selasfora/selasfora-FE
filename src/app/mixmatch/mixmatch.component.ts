import { Component, OnInit,ChangeDetectorRef , ViewChild, ElementRef} from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../cart.service';
import * as THREE from 'three';
declare var window;
declare var clevertap:any;
window.three = THREE;
@Component({
  selector: 'app-mixmatch',
  templateUrl: './mixmatch.component.html',
  styleUrls: ['./mixmatch.component.less'],
})
export class MixmatchComponent implements OnInit {
  url = '/assets/images/mixmatch/charm';
  emptyCharms = null;
  usedCharms1 = [];
  usedCharms2 = [];
  usedCharms3 = [];
  bracelet = {};
  errorMessage = ' ';
  highlightStore = false;
  checkoutUrl = '';
  step = 1;
  private camera;
  private scene;
  private renderer
  private mesh
  private loader = new  THREE.ObjectLoader();
  @ViewChild('canvas') canvas:ElementRef

  constructor(private dragula: DragulaService, public route: ActivatedRoute, private router: Router,
    private detector : ChangeDetectorRef, private ref: ElementRef,
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

  initScene(){
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.set(-10.0, 3.03, 0.03 )
    this.camera.rotation.set(-70.41, -87.23, -70.99 )
    window.camera = this.camera;
    
 
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.detector.detectChanges();
    this.loader.load(
      '/assets/scene.json',
      (scene)=>{
        
      
        setTimeout(()=>{
          this.canvas.nativeElement.appendChild( this.renderer.domElement );
          this.scene = scene;
          window.scene = this.scene;
          this.camera.lookAt(this.scene.children[0].position)
          this.animate()
          },1000)

      }
    );
 

  }

  animate() {
    
        
       this.renderer.render(this.scene, this.camera );

       requestAnimationFrame(this.animate.bind(this))
       
    
   }

  ngOnDestroy() {
    localStorage.setItem("selected_items",'[]');
    this.dragula.destroy('bag-charms');
  }
  
  ngOnInit(){}

  ngAfterViewInit() {
   

    this.route.queryParams
      .subscribe((data) => {
        const s = parseInt(data.step, 10);
        this.step = !s || s > 3 || s < 1 ? 1 : s;

        // if step 3 , load all the charms 
        if (this.step == 3) {
          let data =  JSON.parse(localStorage.getItem('selected_items')) || [];
          let selected_charms = data ? data.filter(i => i.type == "charm") : [];
          this.emptyCharms = selected_charms;
          
          // get the bracelet 

          let bImg = data.find(i => i.type == "bracelet") ? data.find(i => i.type == "bracelet").img[1].src : null;
          this.bracelet =` url(${bImg} )  no-repeat center`;

          if(!selected_charms.length && !bImg){
            this.errorMessage = 'MIXMATCH_ERROR_1';// "You have not selected any bracelet and charms. You can come here again after making a selection."
          }

          if(!selected_charms.length){
            this.errorMessage = 'MIXMATCH_ERROR_2';//"You have not selected any  charms. You can come here again after making a selection."
          }

          if(!bImg){
             this.errorMessage = 'MIXMATCH_ERROR_3';// "You have not selected a bracelet. You can come here again after making a selection."
          }

          if(bImg && selected_charms.length){
            this.errorMessage = null;
            this.initScene()
          }

         
        }

      }
      );
  }

  checkout(){

    // add existing items to cart and checkout 
    let selected_items = JSON.parse(localStorage.getItem('selected_items'));
  
  
    Promise.all(
    selected_items.map(item=>{
     return this._cart.addToCart({variant: item.cartItem.variants[0], quantity: 1},item);
    })
    ).then((done:any)=>{

      let data = done[done.length-1];
      this._cart.updateCount({ count: data.lineItemCount, price: data.subtotal });
      this._cart.updateBasketItems({items:data.lineItems});
      data.updateModel();

      clevertap.event.push("checkout from mixmatch")
      
      window.setTimeout(()=> {
        this.router.navigate(['/cart'])
      }, 500);
      
    })

   
  }


}
