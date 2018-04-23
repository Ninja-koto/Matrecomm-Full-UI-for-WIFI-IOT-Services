import 'style-loader!./userItem.scss';
import { Component,Input,Output,EventEmitter } from '@angular/core';
import {NameSpaceUtil} from "../../../../../commonServices/nameSpaceUtil";
import {SessionStorageService} from "ngx-webstorage";
import {CollectionTableDataCollectorService} from "../../../../../commonServices/tableDataCollector.service";

@Component({
  selector: 'user-item',
  templateUrl: './userItem.html',
  providers:	[CollectionTableDataCollectorService],
})
export class UserItem {
  interValID:any;
lastUpdatedTime:number;
nsObj: NameSpaceUtil;
namespace:string="";
replaceWithNewData=true;
rowsOnEachPage:number=1000;
treeData:any[]=[];

@Output() notify:EventEmitter<any>=new EventEmitter<string>();

  constructor(private storage:SessionStorageService, private tableDataCollectService:CollectionTableDataCollectorService) {
      this.lastUpdatedTime = new Date().getTime();
    }

  onEvent = (event) =>{
        this.notify.emit(event);
  }

  options = {
  allowDrag: false,
  displayField: 'key',
  childrenField: 'values',
  idField: 'uuid',
  allowDrop: (element, to) =>{
    // return true / false based on element, to.parent, to.index. e.g.
    return to.parent.hasChildren;
  }
};

onMoveNode($event) {
  console.log(
    "Moved",
    $event.node.key,
    "to",
    $event.to.parent.key,
    "at index",
    $event.to.index);
};

ngOnInit() {
     this.initiateDataCollection();
}
startInterval(){
  var paramsForData={};
  //console.log("In start Interval...");
  this.interValID = setInterval(() => {
      paramsForData["limit"]=this.rowsOnEachPage;
      let query={};
            paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.namespace;
      let currTime = new Date().getTime();
      if(((currTime-this.lastUpdatedTime)/1000)<200)
          {
              paramsForData["limit"]=this.rowsOnEachPage;
          /*this.tableDataCollectService.getData(paramsForData)
          this.tableDataCollectService.project.subscribe(result => {*/
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                var res = result;
                if(this.replaceWithNewData==true)
                  {
                  let orgs=[];
                    res.data.forEach(org => {
                      orgs.push({
                          "key" : org.organizationName,
                          "type":org.orgType,
                          "city":org.orgCity,
                          "country":org.orgCountry,
                          "orgUUID" : org.uuid
                      });
                    });
                    let tData=[];
                    tData.push({"key":"Organizations","values":orgs})
                    console.log("Organization Tree Data...");
                    console.log(tData);
                    this.treeData= tData;//res.data;
                }
          });
        }
        else
        {
          console.log("Not in Focus...");
          clearInterval(this.interValID);
          this.interValID="undefined";
          this.replaceWithNewData=true;
        }
    }, 10000);
}
initiateDataCollection(){
this.nsObj = new NameSpaceUtil(this.storage);
      this.namespace = this.nsObj.getNameSpace("ApnUserRegistration");
      console.log("NameSpace : "+this.namespace);
      try{
        var paramsForData={};
        let query={};
        paramsForData["projectQuery"]={
          "userName":1,
          "customerID":1,
          "city":1,
          "uuid":1,
        };
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.namespace;
        paramsForData["limit"]=this.rowsOnEachPage;
            this.tableDataCollectService.getPostData(paramsForData)
                .subscribe(result => {
                  var res = result.data;//.json();
                  if(this.replaceWithNewData==true)
                  {
                    let cities={};
                    let treeValues=[];
                    let customerIDs={};
                    console.log(res);
                    res.forEach(element => {
                      if(element["city"]!=undefined)
                      {
                        if(cities[element["city"]]==undefined)
                        {
                          let x=element;
                          let custID={
                            "key":x["customerID"],
                            "locationType":"customerID",
                            "values":[{
                                  "key":x["userName"],
                                  "locationType":"user",
                                  "uuid":x["uuid"]
                                }]
                          };

                          let temp=[];
                          temp.push(custID);
                          cities[element["city"]]= temp;
                        }
                        else
                        {
                          let existCustDataOfCity=cities[element["city"]];
                          /*console.log("existCustDataOfCity");
                          console.log(existCustDataOfCity);*/
                          let custIDindex = existCustDataOfCity.findIndex(ele=>ele.key==element["customerID"]);
                          /*console.log("CUST ID INDEX");
                          console.log(custIDindex);*/
                          if(custIDindex<0)
                          {
                            ///not exist
                            let x=element;
                            let custID={
                              "key":x["customerID"],
                              "locationType":"customerID",
                              "values":[{
                                    "key":x["userName"],
                                    "locationType":"user",
                                    "uuid":x["uuid"]
                                  }]
                            };
                            let custValues=[];
                            custValues= cities[element["city"]];
                            custValues = custValues.concat([custID]);
                            //console.log(custValues);
                            cities[element["city"]]=custValues;
                          }
                          else
                          {
                            //exist
                            let x=element;
                            let userOfCustomer =[];
                            userOfCustomer= existCustDataOfCity[custIDindex]["values"];
                            //CHECK FOR DUPLICATE USE NAMES ALSO    !!! PENDING !!!
                            //let userIndex= userOfCustomer.findIndex(ele=>ele.key==element["userName"]);
                            userOfCustomer = userOfCustomer.concat([{
                              "key":x["userName"],
                              "locationType":"user",
                              "uuid":x["uuid"]
                            }])
                            /*console.log("USERS");
                            console.log(userOfCustomer);*/
                            cities[element["city"]][custIDindex]["values"]=userOfCustomer;
                          }
                        }
                      }
                    });
                    let keys=Object.keys(cities);
                    //console.log(keys);
                    keys.forEach(key => {
                      treeValues.push({
                        "key":key,
                        "locationType":"city",
                        "values":cities[key]
                      })

                    });
                    //console.log(cities);
                    console.log(treeValues);
                    let finalTree=[{
                      "key":"India",
                      "locationType":"country",
                      "values":treeValues
                    }];
                    this.treeData=finalTree;
                    this.replaceWithNewData=false;
                }
                //console.log(res);
          });
      }
      catch(e)
      {
        console.log("Initial Data load Failed... ");
      }
      //this.startInterval();
}
orgTreeDivClicked(e)
{
  /*console.log("In orgTreeDivClicked");
  console.log(e);
  if(String(this.interValID)!="undefined")
    clearInterval(this.interValID);
  this.interValID="undefined";
  this.replaceWithNewData=true;
  this.initiateDataCollection();*/
}
ngOnDestroy() {
  if (this.interValID) {
    console.log("In Tree Component Destroying Set Interval...");
    clearInterval(this.interValID);
  }
}

}
