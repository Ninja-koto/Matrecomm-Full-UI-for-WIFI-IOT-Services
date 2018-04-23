import {Injectable} from "@angular/core";
import {Http, Headers,Response, RequestOptions} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import {Credentials} from "./credentials";
import {SessionStorageService} from "ngx-webstorage";
import {UrlProvider} from "../../commonServices/urlProvider";
@Injectable()
export class LoginService{
    constructor(private http:Http, private url:UrlProvider, private storage:SessionStorageService)
    {
        this.getJSON().subscribe(data => {
            this.storage.store("configParams",data);
            ///TO DISABLE ALL CONSOLE LOGS
            if(data.disableConsoleLogs)
              console.log = function(){};
            console.log("LOGIN SERVICE>>>>>>");
            console.log(data);

          }, error => console.log(error));
    }

      public getJSON(): Observable<any> {
        return this.http.get("assets/param.config.json")
                        .map((res:any) => res.json());
                        //.catch((error:any) => console.log(error));
      }
    signin(credentials:Credentials){
        const body = JSON.stringify(credentials);
        console.log(body);
        var par = {
          "jsonrpc": "2.0",
          "method": "craftAirLogin",
          "id": String(new Date().getTime()),
          "params": credentials
      };
      console.log(par);
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post(/*'http://localhost:8383'*/this.url.getURLForServerRPCCall(),par,{headers:headers})
             .map((response: Response)=> response.json())
              .catch((error: Response)=> Observable.throw(error.json()));
    }

}
