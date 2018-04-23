import { Injectable } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/Rx';
@Injectable()
export class BarchartService {
 constructor(private http: Http) { 
    console.log('Barchart Service Initialized...');
  }
  getBarchart(){
        return this.http.get('http://localhost:4000/barchartList/barchart')
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }
  
}
