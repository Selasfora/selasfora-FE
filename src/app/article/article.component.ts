import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.less']
})
export class ArticleComponent implements OnInit {
  id: string = '';
  article: any = {};
  type:any;
  constructor(public service: AuthService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe((data) => {
        this.id = data.get('id');

        let that = this;
        that.service.fetchArticle(this.id)
        .subscribe(
          (data) => {
            that.article = data;
            console.log('article', data);
          }
        );
      }
    );
  }

}
