//import {PARAMS} from "../../../config";
//import * as config from "../../../configParams"
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import {ReplaySubject} from "rxjs/ReplaySubject";
import 'rxjs/Rx';
import {SessionStorageService} from "ngx-webstorage";
@Injectable()
export class UrlProvider
{
    config:any={};
constructor(private storage:SessionStorageService){
}
    getURLForServerRPCCall(){
        this.config = this.storage.retrieve("configParams");
        /*console.log("In UrlProvider...");
        console.log(this.config);*/
        /*let ip = String(process.env.IP_PART_1)+"."+String(process.env.IP_PART_2)+"."+
                 String(process.env.IP_PART_3)+"."+String(process.env.IP_PART_4);*/
        return "http://"+this.config.serverIP+":"+String(this.config.craftAirServerPort);
        //return "http://"+ip+":"+String(process.env.CRAFTAIR_SERVER_PORT);
    }
    getURLForDataRead(){
        this.config = this.storage.retrieve("configParams");
        /*console.log("In UrlProvider...");
        console.log(this.config);*/
        /*let ip = String(process.env.IP_PART_1)+"."+String(process.env.IP_PART_2)+"."+
                 String(process.env.IP_PART_3)+"."+String(process.env.IP_PART_4);*/
        return "http://"+this.config.serverIP+":"+String(this.config.expressPort);
        //return "http://"+ip+":"+String(process.env.EXPRESS_PORT);
    }
}
