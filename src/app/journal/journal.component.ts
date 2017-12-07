import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router';
import {DynamicTranslationService} from '../dynamic-translation.service'

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.less']
})
export class JournalComponent implements OnInit {

  lists: Array<Array<object>> = [];
  list: Array<object> = [];
  @Input() landing = false;

  pageTitle = "Journal";

  constructor(private router: Router, public service: AuthService, private dynamicTranslation: DynamicTranslationService) { }

  ngOnInit() {
    let that = this;
    this.service.fetchJournal()
    .subscribe(
      (data) => {
        that.list = data;
        data.forEach(function(item, index) {
          let n = Math.floor(index / 3);
          that.lists[n] = that.lists[n] || [];

          /** ensure translations */
         
          let translateText =[
            item.title,
            item.author,
            item.tags,
            item.summary_html,
          ]

          that.dynamicTranslation.getTranslation(translateText,"html").then(res=>{
            item.title = res[0][0];
            item.author = res[0][1];
            item.tags = res[0][2];
            item.summary_html = res[0][3];
            that.lists[n].push(item);
          })
          
        });
      }
    );
  }

}
