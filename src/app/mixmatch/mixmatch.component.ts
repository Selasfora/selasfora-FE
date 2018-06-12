import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../cart.service';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbit-controls'
var orbitControls = OrbitControls(THREE);
declare var window;
declare var clevertap: any;
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
  private rendererId;
  private camera;
  private scene;
  private renderer
  private mesh
  private loader = new THREE.ObjectLoader();
  private ring: any;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private colors = [0xffffff,0x133468,254825]
  @ViewChild('canvas') canvas: ElementRef

  constructor( public route: ActivatedRoute, private router: Router,
    private detector: ChangeDetectorRef, private ref: ElementRef, private _renderer: Renderer2,
    public _cart: CartService) {
  
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
    let data = JSON.parse(localStorage.getItem('selected_items')) || [];
    if (data.length)
      router.navigate(["/mixmatch"], { queryParams: { step: 3 } })

  }



  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5)
    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.set(-0, 0, 40)
    window.camera = this.camera;

    // lights 

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 200, 100);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.9;
    this.scene.add(spotLight);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(- 100, - 200, - 100);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.9;
    this.scene.add(spotLight);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.detector.detectChanges();

    var geometry = new THREE.TorusBufferGeometry(10, -0.08, 12, 100, 5);
    var material = new THREE.MeshStandardMaterial({ color: 0x333333 });
    this.ring = new THREE.Mesh(geometry, material);
    this.ring.rotation.x = 5;
    this.ring.rotation.z = 2.2;
    this.scene.add(this.ring);
    window.ring = this.ring;

    for (let i = 0.4; i < 2 * Math.PI - 0.5 * Math.PI; i += (2 * Math.PI - 0.5 * Math.PI) / 12) {
      let s = this.createCharmsGeometry();
      s.position.x = 10 * Math.cos(i)
      s.position.y = 10 * Math.sin(i)
      s.colorIndex = 4;
      s.material.transparent = true;
      s.material.opacity = 0.3;
      s.material.color = new THREE.Color( 0x000000 )
      this.ring.add(s)
    }

    // let controls = new orbitControls(this.camera);
    // controls.enableRotate = false;
    setTimeout(() => {
      this.canvas.nativeElement.appendChild(this.renderer.domElement);
      window.scene = this.scene;
      this.camera.lookAt(0, 0, 0)
      this._renderer.listen('document', 'mouseup', (event) => {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        let intersects = this.raycaster.intersectObjects(this.ring.children);

        for (var i = 0; i < intersects.length; i++) {

          let obj = intersects[i].object;
          obj.colorIndex = obj.colorIndex <= 3 ? obj.colorIndex +1 : 0

          if(obj.colorIndex == 3){
            obj.material.color = new THREE.Color(0x000000);
            obj.material.opacity = 0.3
          }
          else{
            obj.material.color = new THREE.Color(this.colors[obj.colorIndex])
            obj.material.opacity = 1;
          }

          

        }
        
      })
      this.animate()
    }, 1000)




  }

  createCharmsGeometry() {

    var geometry = new THREE.SphereGeometry(0.5, 32, 32);
    var material = new THREE.MeshStandardMaterial({ color: 0x333333 });
    var sphere = new THREE.Mesh(geometry, material);
    return sphere
  }

  animate() {

    this.camera.lookAt(0, 0, 0)
    this.renderer.render(this.scene, this.camera);

    this.rendererId = requestAnimationFrame(this.animate.bind(this))


  }

  ngOnDestroy() {
    localStorage.setItem("selected_items", '[]');
    cancelAnimationFrame(this.rendererId);
  }

  ngOnInit() { }

  ngAfterViewInit() {


    this.route.queryParams
      .subscribe((data) => {
        const s = parseInt(data.step, 10);
        this.step = !s || s > 3 || s < 1 ? 1 : s;

        // if step 3 , load all the charms 
        if (this.step == 3) {
          let data = JSON.parse(localStorage.getItem('selected_items')) || [];
          let selected_charms = data ? data.filter(i => i.type == "charm") : [];
          this.emptyCharms = selected_charms;

          // get the bracelet 

          let bImg = data.find(i => i.type == "bracelet") ? data.find(i => i.type == "bracelet").img[1].src : null;
          this.bracelet = ` url(${bImg} )  no-repeat center`;

          if (!selected_charms.length && !bImg) {
            this.errorMessage = 'MIXMATCH_ERROR_1';// "You have not selected any bracelet and charms. You can come here again after making a selection."
          }

          if (!selected_charms.length) {
            this.errorMessage = 'MIXMATCH_ERROR_2';//"You have not selected any  charms. You can come here again after making a selection."
          }

          if (!bImg) {
            this.errorMessage = 'MIXMATCH_ERROR_3';// "You have not selected a bracelet. You can come here again after making a selection."
          }

          if (bImg && selected_charms.length) {
            this.errorMessage = null;
            this.initScene()
          }


        }

      }
      );
  }

  checkout() {

    // add existing items to cart and checkout 
    let selected_items = JSON.parse(localStorage.getItem('selected_items'));


    Promise.all(
      selected_items.map(item => {
        return this._cart.addToCart({ variant: item.cartItem.variants[0], quantity: 1 }, item);
      })
    ).then((done: any) => {

      let data = done[done.length - 1];
      this._cart.updateCount({ count: data.lineItemCount, price: data.subtotal });
      this._cart.updateBasketItems({ items: data.lineItems });
      data.updateModel();

      clevertap.event.push("checkout from mixmatch")

      window.setTimeout(() => {
        this.router.navigate(['/cart'])
      }, 500);

    })


  }


}
