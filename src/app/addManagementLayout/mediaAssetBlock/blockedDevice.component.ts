import {Component,OnInit} from '@angular/core';
import { BaThemeSpinner } from "../../theme/services";
import {Http, Headers,Response, RequestOptions} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../commonServices/RPC.service";
import {CustomValidator} from "../../commonServices/customValidator.service";
import {Logger} from "../../commonServices/logger";
import {SessionStorageService} from "ngx-webstorage";
import {UrlProvider} from "../../commonServices/urlProvider";
import { CollectionTableDataCollectorService } from '../../commonServices/tableDataCollector.service';
import {NameSpaceUtil} from "../../commonServices/nameSpaceUtil";
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'blockedDeviceMain',
  templateUrl: 'blockedDevice.component.html',
  styles:[`.btn btn-primary{
  position: absolute;
    top: 50%;
}`],
    providers:[RPCService, CollectionTableDataCollectorService]
})
export class blockedDevice implements OnInit{


    uploadedFiles:any=[];
    selectFileErrmsg:String="";
    fileDataCollected:Boolean=false;
    selectedFilesList:FileList;
    canProceedToUpload:Boolean=false;
    httpCall:XMLHttpRequest;
    nsObj:NameSpaceUtil;
 mainTab:string = "blockedDevice";

  constructor(private _spinner:BaThemeSpinner, private tableDataCollectService:CollectionTableDataCollectorService,
        private clientRpc: RPCService, private http:Http,private storage:SessionStorageService, private url:UrlProvider) {
        this._spinner.show();
        this.nsObj = new NameSpaceUtil(this.storage);
      }

       mainTabChanged(e)
    {
      this.mainTab = String(e.tabID);
    }

getUploadedFilesData(){
    console.log("In getUploadedFilesData");
    console.log(new Date());

        try{

        var paramsForData={};
        let query={}, projectQuery={};
        paramsForData["projectQuery"]=projectQuery;
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.nsObj.getNameSpace("uploads.files");
        paramsForData["limit"]=-1;
        console.log(paramsForData);

        this.tableDataCollectService.getPostData(paramsForData)
            .subscribe(result => {
                var res = result;//json();
                console.log("UPloaded Files");
                console.log(res.data);
                if(res!=undefined)
                {
                if(res.data==undefined)
                    this.uploadedFiles=[];
                else
                    this.uploadedFiles=res.data
                }
                else
                    this.uploadedFiles=[];
                console.log(this.uploadedFiles);
         //       console.log(this.uploadedFiles[0].filename);
                //this.myForm.controls.adFile.reset();
                //this.myForm.reset();
                this.fileDataCollected=true;
                this._spinner.hide();
        });

        }
        catch(e)
        {
        this._spinner.hide();
        console.log("getUploadedFilesData Failed... ");
        }
      }
ngOnInit() {
 this.getUploadedFilesData();
}

 ngAfterViewInit() {
    this._spinner.hide();
  }
}
