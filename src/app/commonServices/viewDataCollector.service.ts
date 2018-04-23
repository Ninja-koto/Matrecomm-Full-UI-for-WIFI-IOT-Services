import { Injectable } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
import {UrlProvider} from "./urlProvider";
@Injectable()
export class ViewDataCollectorService {
    project:Observable<Array<any>>;
 constructor(private http: Http, private url:UrlProvider) { 
     this.project = new ReplaySubject(1);
    //console.log('ViewDataCollector Service Initialized...');
      
  }


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


  getPostDataForApStats(dataObj:any){
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
      //console.log("currStaart DAte",oldDate);
      
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.url.getURLForDataRead()+"/tableData/dataForApStats",dataObj,{headers:headers})
             .map((response: Response)=> {
               return response.json()
              })
              .catch((error: Response)=> {
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

  getAggregatedData(dataObj:any){
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.url.getURLForDataRead()+"/tableData/getAggregatedData",dataObj,{headers:headers})
             .map((response: Response)=> {
               return response.json()
              })
              .catch((error: Response)=> {
                console.log("ERROR");
                console.log(error.json());
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }
  getAggregatedDataForUpTime(dataObj:any){
    const headers = new Headers({'Content-Type':'application/json'});
    return this.http.post(this.url.getURLForDataRead()+"/tableData/getAggregatedDataForUpTime",dataObj,{headers:headers})
         .map((response: Response)=> {
           return response.json()
          })
          .catch((error: Response)=> {
            return [error.json()];
            //return Observable.throw(error.json())
          });
}

getDataOfTwoCalls(dataObj:any,dataObj1:any){

  const headers = new Headers({'Content-Type':'application/json'});
  return Observable.forkJoin([
    this.http.post(this.url.getURLForDataRead()+"/tableData/getAggregatedData",dataObj,{headers:headers})
        .map((response: Response)=> {return response.json()}).catch((error: Response)=> {return [error.json()];}),
    
    this.http.post(this.url.getURLForDataRead()+"/tableData/getAggregatedData",dataObj1,{headers:headers})
     .map((response: Response)=> {return response.json()}).catch((error: Response)=> {return [error.json()];})
  ])
  .map((data: any[]) => {
    //console.log("FROM SEVICE>>>>>");
    //console.log(data);
    //console.log(data[1].data);
    let temp=[];
    temp=temp.concat(data[0].data,data[1].data);
    return temp;
  });

}

  
}
