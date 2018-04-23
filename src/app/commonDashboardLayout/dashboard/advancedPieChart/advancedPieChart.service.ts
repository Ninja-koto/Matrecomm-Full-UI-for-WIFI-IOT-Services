import { Injectable } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
import {UrlProvider} from "../../../commonServices/urlProvider";
@Injectable()
export class AdvancedPiechartService {
 constructor(private http: Http,private url:UrlProvider) { 
    console.log('piechart Service Initialized...');
  }
  getPiechart(){
        return this.http.get(this.url.getURLForDataRead()+'/piechartList/piechart'/*'http://localhost:4000/piechartList/piechart'*/)
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }
  
}
