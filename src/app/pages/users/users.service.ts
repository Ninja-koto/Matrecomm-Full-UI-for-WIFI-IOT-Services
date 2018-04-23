import { Injectable, AfterContentInit } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
import {UrlProvider} from "../../commonServices/urlProvider";
@Injectable()
export class UsersService{
  project:Observable<Array<any>>;
  count:number;
 constructor(private http: Http, private url:UrlProvider) { 
   this.project = new ReplaySubject(1);
   this.count=0;
    console.log('User Service Initialized...');
  }
  /*getUsers(){
        return this.http.get('http://localhost:4000/userlist/userManagement')
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }*/
  getUsers(){
      /*this.project	=	new	Observable(observer	=>	{          
                this.http.get('http://localhost:4000/userlist/userManagement').subscribe(result => {
                  //console.log(result);
                  observer.next(result);
                });
						});*/
      return this.http.get(this.url.getURLForDataRead()+'/userlist/userManagement'/*'http://localhost:4000/userlist/userManagement'*/)
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }

}
