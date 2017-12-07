import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/map';



@Injectable()
export class DynamicTranslationService {
  private currentLang:string;
  private api = environment.apiPath+"translate";
  constructor(private http: HttpClient) { 
    this.currentLang = 'en'
  }

  setLang(lang){
    this.currentLang = lang || 'en';
  }


  getTranslation(text:any[],format:string){
    // check for text validity

    text = text.map(t=> t || " ");

    let reqbody ={
        "text": 
          text
        ,
        "target": this.currentLang, // TODO: add this after debugging this.currentLang
        "format":format || "text"

      }
    
   if(this.currentLang == 'en'){
    return new Promise((resolve,reject)=>{
      resolve([
        text
      ])
    })

   
    

    
   }
   else
   return  this.http.post(this.api,reqbody).map(res=>res).toPromise();
  }

}
