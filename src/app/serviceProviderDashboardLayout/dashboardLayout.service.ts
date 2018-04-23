import { Injectable } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
import {UrlProvider} from "../commonServices/urlProvider";
@Injectable()
export class DashboardDataService {
    project:Observable<Array<any>>;
 constructor(private http: Http,private url:UrlProvider) { 
     this.project = new ReplaySubject(1);
    console.log('DashboardData Service Initialized...');
  }

  /*getPiechart(){
        return this.http.get('http://localhost:4000/dashboardData/dataForDashboard')
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }*/


    getData(limit:any){
      let l = limit.limit;
      //let url="http://localhost:4000/dashboardData/dataForDashboard?namespace="+limit.namespace;
      let url= this.url.getURLForDataRead()+"/dashboardData/dataForDashboard?namespace="+limit.namespace;
      if((l>0)&&(String(l)!="")&&(String(l)!="undefined"))
        url = url+"&limit="+String(l);
      else
      {
        //url="http://localhost:4000/dashboardData/dataForDashboard?namespace="+limit.namespace;
        url= this.url.getURLForDataRead()+"/dashboardData/dataForDashboard?namespace="+limit.namespace;
      }
      let dat = limit.date;
      //console.log("DAte : "+dat);
      if((String(dat)!="")&&(String(dat)!="undefined"))
      {
          url=url+"&date="+dat;
      }
        
      /*this.project	=	new	Observable(observer	=>	{          
            this.http.get(url).subscribe(result => {
                //console.log(result);
                observer.next(result);
            });
		});*/
    return this.http.get(url)
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }

  
}
