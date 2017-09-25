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
  highlightStore = false;

  constructor(private dragula: DragulaService) {
    this.dragula.setOptions('bag-charms', {
      //removeOnSpill: true
    });
  }

  ngOnInit() {
    this.dragula
      .drag
      .subscribe(value => {
        //console.log('drag', value);
        this.highlightStore = true;
      });

    this.dragula
      .drop
      .subscribe(value => {
        console.log('drop', this.emptyCharms, this.usedCharms);
      });

    this.dragula
      .out
      .subscribe(value => {
        //console.log('out', value);
      });

    this.dragula
      .remove
      .subscribe(value => {
        console.log('remove', this.emptyCharms, this.usedCharms);
      });

    this.dragula
      .dragend
      .subscribe(value => {
        console.log('dragend', this.emptyCharms, this.usedCharms);
        this.highlightStore = false;
      });
  }

}
