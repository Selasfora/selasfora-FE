import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {DynamicTranslationService} from "../dynamic-translation.service";
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
  constructor(public service: AuthService, public route: ActivatedRoute, private router: Router, private dynamicTranslation: DynamicTranslationService) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe((data) => {
        this.id = data.get('id');

        let that = this;
        that.service.fetchArticle(this.id)
        .subscribe(
          (data) => {

            /** translate article */
              /** ensure translations */
          let parser = new DOMParser();
          let translateText =[
            data.title,
            data.author,
            data.tags,
            data.body_html,
          ]

          that.dynamicTranslation.getTranslation(translateText).subscribe(res=>{
            data.title = res[0][0];
            data.author = res[0][1];
            data.tags = res[0][2];
            data.body_html = res[0][3];
            that.article = data;
            console.log('article', data);
           
          })

            
          }
        );
      }
    );
  }

}
