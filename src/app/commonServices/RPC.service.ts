import { Injectable, AfterContentInit } from '@angular/core';
import { Http,Response, Headers } from '@angular/http';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
//import {SessionStorage} from "./sessionStorage";
import {SessionStorageService} from "ngx-webstorage";
import {UrlProvider} from "./urlProvider";
@Injectable()
export class RPCService{
  count:number;
  constructor(private http: Http,private storage:SessionStorageService, private url:UrlProvider) {
    this.count=0;
    console.log('ClientRPC Service Initialized...');
  }
  orgRPCCall(operation:string, rpcMethod:string, data:any){
      console.log("In Client RPC Call....");
      var content=
          {
            "methodName":operation,
            "role":this.storage.retrieve("role"),
            "CraftAirProductMgrName":this.storage.retrieve("productMgrName"),
            "CraftAirOrgMgrUUID":this.storage.retrieve("orgMgrUUID"),
            "CraftAirOrgMgrName":this.storage.retrieve("orgMgrName"),
            "params":data
          }
      var par = {
          "jsonrpc": "2.0",
          "method": rpcMethod,
          "id": String(new Date().getTime()),
          "params": content
      };
      console.log("Client RPC Service...");
      console.log(par);

        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(/*'http://localhost:8383'*/this.url.getURLForServerRPCCall(),par,{headers:headers})
             .map((response: Response)=> {
               return response.json()
              })
              .catch((error: Response)=> {
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

  serviceProviderRPCCall(operation:string, rpcMethod:string, data:any){
      console.log("In ServiceProvider RPC Call....");
      var content=
          {
            "methodName":operation,
            "role":this.storage.retrieve("role"),
            "CraftAirProductMgrName":this.storage.retrieve("productMgrName"),
            "params":data
          }
      var par = {
          "jsonrpc": "2.0",
          "method": rpcMethod,
          "id": String(new Date().getTime()),
          "params": content
      };
      console.log("ServiceProvider RPC Service...");
      console.log(par);

        const headers = new Headers({'Content-Type':'application/json'});

        return this.http.post(/*'http://localhost:8383'*/this.url.getURLForServerRPCCall() ,par,{headers:headers})
             .map((response: Response)=> response.json())
              .catch((error: Response)=> {
                return [error.json()];
                //return Observable.throw(error.json())
              });
  }

}
