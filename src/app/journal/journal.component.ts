import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.less']
})
export class JournalComponent implements OnInit {

  list: Array<object> = [];

  constructor(private router: Router, public service: AuthService) { }

  ngOnInit() {
    this.service.fetchJournal()
    .subscribe(
      (data) => {
        this.list = data;
      }
    );
  }

}
