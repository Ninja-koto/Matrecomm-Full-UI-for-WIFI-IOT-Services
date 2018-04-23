import { Injectable, AfterContentInit } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import {UrlProvider} from "../../../commonServices/urlProvider";
import 'rxjs/Rx';
@Injectable()
export class RadiusTableDataCollectorService{
  project:Observable<Array<any>>;
  count:number;
 constructor(private http: Http, private url:UrlProvider) { 
   this.project = new ReplaySubject(1);
   this.count=0;
    console.log('CollectionTableDataCollector Service Initialized...');
  }

  getData(limit:any){
      let l = limit.limit;
      let currDate= new Date().toISOString();
      let oldDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString();
      console.log("Old Data : "+oldDate);
      console.log("Curr Data : "+currDate);
      let url=this.url.getURLForDataRead()+"/tableData/dataForCollectionTable?namespace="+limit.namespace+"&start="+oldDate+"&current="+currDate;
      if((l>0)&&(String(l)!="")&&(String(l)!="undefined"))
        url = url+"&limit="+String(l);
      else
        url=this.url.getURLForDataRead()+"/tableData/dataForCollectionTable?namespace="+limit.namespace+"&start="+oldDate+"&current="+currDate;
      let dat = limit.date;
      //console.log("DAte : "+dat);
      if((String(dat)!="")&&(String(dat)!="undefined"))
      {
          url=url+"&date="+dat;
      }
        console.log("URL : "+url);
      return this.http.get(url)
        .map((res:Response) => res.json())
        .catch((error: Response)=> Observable.throw(error.json()));
  }

  getPostData(dataObj:any){
      let l = dataObj.limit;
      if((l>0)&&(String(l)!="")&&(String(l)!="undefined"))
      {
        dataObj["limit"]=l;
      }
      //else
      //  dataObj["limit"]=10;
      let dat = dataObj.date;
      if((String(dat)!="")&&(String(dat)!="undefined"))
      {
        dataObj["date"]=dat;
      }
      let currDate= new Date().toISOString();
      let oldDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()).toISOString();
      //dataObj["start"]=oldDate;
      //dataObj["current"]=currDate;
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.url.getURLForDataRead()+"/tableData/dataForCollectionTable",dataObj,{headers:headers})
             .map((response: Response)=> {
               return response.json()
              })
              .catch((error: Response)=> {
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

}
