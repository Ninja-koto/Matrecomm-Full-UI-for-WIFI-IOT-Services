/*import { Injectable, AfterContentInit } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
@Injectable()
export class EmailServerService{
  project:Observable<Array<any>>;
  count:number;
 constructor(private http: Http) { 
   this.project = new ReplaySubject(1);
   this.count=0;
    console.log('EmailServer Service Initialized...');
  }
  getUsers(){
        return this.http.get('http://localhost:4000/userlist/userManagement')
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }
  getData(limit:any){
      let l = limit.limit;
      let url="http://localhost:4000/tableData/dataForCollectionTable?namespace="+limit.namespace;
      if((l>0)&&(String(l)!="")&&(String(l)!="undefined"))
        url = url+"&limit="+String(l);
      else
        url="http://localhost:4000/tableData/dataForCollectionTable?namespace="+limit.namespace;
      let dat = limit.date;
      //console.log("DAte : "+dat);
      if((String(dat)!="")&&(String(dat)!="undefined"))
      {
          url=url+"&date="+dat;
      }
        

      this.project	=	new	Observable(observer	=>	{          
                this.http.get(url).subscribe(result => {
                  //console.log(result);
                  observer.next(result);
                });
						});
  }

}
*/