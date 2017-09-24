import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-mixmatch',
  templateUrl: './mixmatch.component.html',
  styleUrls: ['./mixmatch.component.less']
})
export class MixmatchComponent implements OnInit {
  url = '/assets/images/mixmatch/charm';
  emptyCharms = [this.url + 1 + '.png', this.url + 2 + '.png', this.url + 3 + '.png'];
  usedCharms = [];
  msg = '';

  constructor(private dragula: DragulaService) {
    this.dragula.setOptions('bag-items', {
      revertOnSpill: true
    });
  }

  ngOnInit() {
    this.dragula
      .drag
      .subscribe(value => {
        //this.msg = `Dragging the ${ value[1].innerText }!`;
        console.log('drag', value);
      });

    this.dragula
      .drop
      .subscribe(value => {
        //this.msg = `Dropped the ${ value[1].innerText }!`;
        console.log('drop', value);
        setTimeout(() => {
          this.msg = '';
        }, 1000);
      });
  }

}
