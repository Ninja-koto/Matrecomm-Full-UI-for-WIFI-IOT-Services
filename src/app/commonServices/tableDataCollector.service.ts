import { Injectable, AfterContentInit } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
import {UrlProvider} from "./urlProvider";
@Injectable()
export class CollectionTableDataCollectorService{
  project:Observable<Array<any>>;
  count:number;
 constructor(private http: Http, private url:UrlProvider) { 
   this.project = new ReplaySubject(1);
   this.count=0;
    //console.log('CollectionTableDataCollector Service Initialized...');
  }
  getExtraData(params:any){
      let l = params.limit;
      //let url="http://localhost:4000/tableData/dataForCollectionTable?namespace="+params.namespace;
      let url= this.url.getURLForDataRead()+"/tableData/dataForCollectionTable?namespace="+params.namespace;
      if((l>0)&&(String(l)!="")&&(String(l)!="undefined"))
        url = url+"&limit="+String(l);
      else
      {
        //url="http://localhost:4000/tableData/dataForCollectionTable?namespace="+params.namespace;
        url= this.url.getURLForDataRead()+"/tableData/dataForCollectionTable?namespace="+params.namespace;
      }
      let dat = params.date;
      //console.log("DAte : "+dat);
      if((String(dat)!="")&&(String(dat)!="undefined"))
      {
          url=url+"&date="+dat;
      }
        return this.http.get(url)
    .map((res:Response) => res.json())
   .catch((error: Response)=> Observable.throw(error.json()));
  }

  /*getData(limit:any){
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
  }*/
  getData(limit:any){
      let l = limit.limit;
      //let url="http://localhost:4000/tableData/dataForCollectionTable?namespace="+limit.namespace;
      let url= this.url.getURLForDataRead()+"/tableData/dataForCollectionTable?namespace="+limit.namespace;
      if((l>0)&&(String(l)!="")&&(String(l)!="undefined"))
        url = url+"&limit="+String(l);
      else
      {
        //url="http://localhost:4000/tableData/dataForCollectionTable?namespace="+limit.namespace;
        url= this.url.getURLForDataRead()+"/tableData/dataForCollectionTable?namespace="+limit.namespace;
      }
      let dat = limit.date;
      //console.log("DAte : "+dat);
      if((String(dat)!="")&&(String(dat)!="undefined"))
      {
          url=url+"&date="+dat;
      }
                  
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

  deleteUploaded(dataObj:any){    
      const headers = new Headers({'Content-Type':'application/json'});
      return this.http.post(this.url.getURLForDataRead()+"/tableData/deleteUploaded",dataObj,{headers:headers})
           .map((response: Response)=> {
             return response.json()
            })
            .catch((error: Response)=> {
              return [error.json()];
              //return Observable.throw(error.json())
            });
}
readUploadedImageFile(dataObj:any){    
  //const headers = new Headers({'Content-Type':'application/json'});
  return this.http.post(this.url.getURLForDataRead()+"/tableData/readUploadedImageFile",dataObj)
       .map((response: Response)=> {
         return response;
        })
        .catch((error: Response)=> {
          return [error];
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
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

  getOnlineOfflineAssetCount(dataObj:any,dataObj1:any){ 
      const headers = new Headers({'Content-Type':'application/json'});
      return Observable.forkJoin([
        this.http.post(this.url.getURLForDataRead()+"/tableData/getAggregatedData",dataObj,{headers:headers})
            .map((response: Response)=> {return response.json()}).catch((error: Response)=> {return [error.json()];}),
        
        this.http.post(this.url.getURLForDataRead()+"/tableData/getAggregatedData",dataObj1,{headers:headers})
         .map((response: Response)=> {return response.json()}).catch((error: Response)=> {return [error.json()];})
      ])
      .map((data: any[]) => {
        /*console.log("FROM SEVICE>>>>>");
        console.log(data);
        console.log(data[1].data);*/
        let temp=[];
        temp=temp.concat(data[0].data,data[1].data);
        return temp;
      });
  }

  createView(dataObj:any){
      
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(this.url.getURLForDataRead()+"/tableData/createView",dataObj,{headers:headers})
             .map((response: Response)=> {
               return response.json()
              })
              .catch((error: Response)=> {
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

}
