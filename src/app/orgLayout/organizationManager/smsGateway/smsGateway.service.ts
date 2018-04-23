/*import { Injectable, AfterContentInit } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
@Injectable()
export class SMSGatewayService{
  project:Observable<Array<any>>;
  count:number;
 constructor(private http: Http) { 
   this.project = new ReplaySubject(1);
   this.count=0;
    console.log('EmailServer Service Initialized...');
  }
  /*getUsers(){
        return this.http.get('http://localhost:4000/tableData/userManagement')
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }*
  getData(){
      this.project	=	new	Observable(observer	=>	{          
                this.http.get('http://localhost:4000/tableData/userManagement').subscribe(result => {
                  //console.log(result);
                  observer.next(result);
                });
						});
  }

}
*/