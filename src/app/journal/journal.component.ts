import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router';

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

  constructor(private router: Router, public service: AuthService) { }

  ngOnInit() {
    let that = this;
    this.service.fetchJournal()
    .subscribe(
      (data) => {
        that.list = data;
        data.forEach(function(item, index) {
          let n = Math.floor(index / 3);
          that.lists[n] = that.lists[n] || [];
          that.lists[n].push(item);
        });
      }
    );
  }

}
