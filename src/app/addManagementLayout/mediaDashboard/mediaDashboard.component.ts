import { Component } from '@angular/core';

import { Http, Headers, Response, RequestOptions } from "@angular/http";
import "rxjs/Rx";
import { Observable } from "rxjs";
import * as jQuery from "jquery";
import { Logger } from "../../commonServices/logger";
import { LocalStorageService } from "ngx-webstorage";
import { UrlProvider } from "../../commonServices/urlProvider";
import { CollectionTableDataCollectorService } from '../../commonServices/tableDataCollector.service';
import { NameSpaceUtil } from "../../commonServices/nameSpaceUtil"
import {AggrQueryService} from "../../commonServices/pipeLine_AggrQueries";
import {BaThemeSpinner} from "../../theme/services";
import {ViewDataCollectorService} from "../../commonServices/viewDataCollector.service";

@Component({
  selector: 'mediaDashboard',
  templateUrl: './mediaDashboard.component.html',
  providers:[AggrQueryService, CollectionTableDataCollectorService,ViewDataCollectorService]
})

export class MediaDashboard {
  nsObj: NameSpaceUtil;
  namespace:string="";
  lastUpdatedTime:number;
  rowsOnEachPage:number=1000;
  
  constructor(private tableDataCollectService: CollectionTableDataCollectorService,
              private storage: LocalStorageService,
              private _spinner: BaThemeSpinner,
              private aggrQuery:AggrQueryService,
              private viewDataCollectService:ViewDataCollectorService
            ) {
              this._spinner.show();
              this.lastUpdatedTime = new Date().getTime();

  }
  ngOnInit() {
    //this.getAll();
    this.nsObj = new NameSpaceUtil(this.storage);
    this.namespace = this.nsObj.getNameSpace("MediaDashboardData");
    console.log("NameSpace : "+this.namespace); 

  }


  getNameSpace(coll:string){
    return this.nsObj.getNameSpace(coll);
  }

  ngAfterViewInit(){
    this._spinner.hide();
  }
 
  getMediaDashboardBySongsQuery(){
    let pipeline = [
      //{$match:{"mediaGenre" : "Songs"}},
      {"$project": {"mediaGenre":1,"mediaLanguage" : 1,"mediaFileName":1}},
      {$match:{$or:[{"mediaGenre" : "Songs"},{"mediaGenre" : "songs"},{"mediaGenre" : "song"},{"mediaGenre" : "Song"}]}},
       { $sort: { date: 1 } },
       {
           $group:{
               _id: "$mediaFileName",
               value: { $sum: 1 }, 
               name:{$first:"$mediaFileName"},
             
           }
       }
   ]; //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
  //if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  //return [];
  return pipeline;
  }


  getMediaDashboardByMoviesQuery(){
    let pipeline = [
      //{$match:{"mediaGenre" : "Movies"}},
      {"$project": {"mediaGenre":1,"mediaLanguage" : 1,"mediaFileName":1}},
      {$match:{$or:[{"mediaGenre" : "Movies"},{"mediaGenre" : "movies"},{"mediaGenre" : "movie"},{"mediaGenre" : "Movie"}]}},
       { $sort: { date: 1 } },
       {
           $group:{
               _id: "$mediaFileName",
               value: { $sum: 1 }, 
               name:{$first:"$mediaFileName"},
             
           }
       }
   ]; //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
  //if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  //return [];
  return pipeline;
  }


  getMediaDashboardBySerialsQuery(){
    let pipeline = [
      //{$match:{"mediaGenre" : "Serials"}},
      {"$project": {"mediaGenre":1,"mediaLanguage" : 1,"mediaFileName":1}},
      {$match:{$or:[{"mediaGenre" : "Serials"},{"mediaGenre" : "serials"},{"mediaGenre" : "serial"},{"mediaGenre" : "Serial"}]}},
       { $sort: { date: 1 } },
       {
           $group:{
               _id: "$mediaFileName",
               value: { $sum: 1 }, 
               name:{$first:"$mediaFileName"},
             
           }
       }
   ]; //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
  //if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  //return [];
  return pipeline;
  }
/*
  getMediaDashboardByLanguagesQuery(){
    let pipeline = [
      {$match:{$or:[{"mediaGenre" : "serials"},{"mediaGenre" : "movie"},{"mediaGenre" : "songs"}]}},
       { $sort: { date: 1 } },
       {
           $group:{
               _id: "$mediaLanguage",
               value: { $sum: 1 }, 
               name:{$first:"$mediaLanguage"},
             
           }
       }
   ]; //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
  //if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  //return [];
  return pipeline;
  }

*/
  getMediaDashboardBySongsLanguageQuery(){
    let pipeline = [
      //{$match:{"mediaGenre" : "Songs"}},
      {"$project": {"mediaGenre":1,"mediaLanguage" : 1,"mediaFileName":1}},
      {$match:{$or:[{"mediaGenre" : "Songs"},{"mediaGenre" : "songs"},{"mediaGenre" : "song"},{"mediaGenre" : "Song"}]}},
       { $sort: { date: 1 } },
       {
        $group:{
            _id: {"lang":"$mediaLanguage","file":"$mediaFileName"},
            value: { $sum: 1 }, 
            name:{$first:"$mediaLanguage"},
        }
        },
        {
            $group:{
                _id: "$name",
                value: { $sum: 1 }, 
                name:{$first:"$name"},
            }
        }
   ]; //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
  //if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  //return [];
  return pipeline;
  }


  getMediaDashboardByMoviesLanguageQuery(){
    let pipeline = [
      //{$match:{"mediaGenre" : "Movies"}},
      {"$project": {"mediaGenre":1,"mediaLanguage" : 1,"mediaFileName":1}},
      {$match:{$or:[{"mediaGenre" : "Movies"},{"mediaGenre" : "movies"},{"mediaGenre" : "movie"},{"mediaGenre" : "Movie"}]}},
       { $sort: { date: 1 } },
       {
        $group:{
            _id: {"lang":"$mediaLanguage","file":"$mediaFileName"},
            value: { $sum: 1 }, 
            name:{$first:"$mediaLanguage"},
        }
        },
        {
            $group:{
                _id: "$name",
                value: { $sum: 1 }, 
                name:{$first:"$name"},
            }
        }
   ]; //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
  //if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  //return [];
  return pipeline;
  }



  getMediaDashboardBySerialsLanguageQuery(){
    let pipeline = [
      //{$match:{"mediaGenre" : "Serials"}},
      {"$project": {"mediaGenre":1,"mediaLanguage" : 1,"mediaFileName":1}},
      {$match:{$or:[{"mediaGenre" : "Serials"},{"mediaGenre" : "serials"},{"mediaGenre" : "serial"},{"mediaGenre" : "Serial"}]}},
       { $sort: { date: 1 } },
       {
        $group:{
            _id: {"lang":"$mediaLanguage","file":"$mediaFileName"},
            value: { $sum: 1 }, 
            name:{$first:"$mediaLanguage"},
        }
        },
        {
            $group:{
                _id: "$name",
                value: { $sum: 1 }, 
                name:{$first:"$name"},
            }
        }
   ]; //this.aggrQuery.getAggrQuery()["inventoryByVendor"];
  //if((String(pipeline)=="undefined")||(String(pipeline)=="null"||(String(pipeline)=="")))
  //return [];
  return pipeline;
  }




}
