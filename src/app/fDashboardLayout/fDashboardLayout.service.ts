import { Injectable } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
import {UrlProvider} from "../commonServices/urlProvider";
@Injectable()
export class FDashboardDataService {
    project:Observable<Array<any>>;
 constructor(private http: Http, private url:UrlProvider) { 
     this.project = new ReplaySubject(1);
    console.log('DashboardData Service Initialized...');
  }

getCountData(dataObj:any){
        let currDate= new Date().toISOString();
        let oldDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString();
        //dataObj["start"]=oldDate;
        //dataObj["current"]=currDate;
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.url.getURLForDataRead()+"/tableData/getCount",dataObj,{headers:headers})
             .map((response: Response)=> {
               return response.json()
              })
              .catch((error: Response)=> {
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

getAggrData(dataObj:any){
        let currDate= new Date().toISOString();
        let oldDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString();
        //dataObj["start"]=oldDate;
        //dataObj["current"]=currDate;
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.url.getURLForDataRead()+"/tableData/getUsedData",dataObj,{headers:headers})
             .map((response: Response)=> {
               return response.json()
              })
              .catch((error: Response)=> {
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

  
}
