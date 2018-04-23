import {Component,OnInit} from "@angular/core"
import {BaThemeSpinner} from "../../theme/services";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response, RequestOptions} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../commonServices/RPC.service";
import {CustomValidator} from "../../commonServices/customValidator.service";
import {Logger} from "../../commonServices/logger";
import {SessionStorageService} from "ngx-webstorage";
import {UrlProvider} from "../../commonServices/urlProvider";

import { FileUploader } from 'ng2-file-upload';

@Component({
    selector:"adv-mgmt",
    templateUrl:'advMgmt.component.html',
    providers:[RPCService]
})

export class AdvertisementManagement implements OnInit {
    public myForm: FormGroup;
    logofr :FileReader;
    imageLogoStr:any;
    imageLogoURL:string;

    public uploader:FileUploader = new FileUploader({url: "http://127.0.0.1:4000/tableData/upload"});

    constructor(private _spinner:BaThemeSpinner,private _fb: FormBuilder,
        private clientRpc: RPCService, private http:Http,private storage:SessionStorageService, private url:UrlProvider) {
        this._spinner.show();
      }
      ngOnInit(){
        this.myForm = this._fb.group({
            fileName: ['', [Validators.required, Validators.minLength(5)]],
            //adFile: ['', []],
        });
        //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
        this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
        //overide the onCompleteItem property of the uploader so we are
        //able to deal with the server response.
        this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            console.log("ImageUpload:uploaded:", item, status, response);
        };
        this.subcribeToFormChanges();
      }



      ngAfterViewInit(){
        this._spinner.hide();
      }


      imageLogoProcessFile(e){
          console.log("File Loaded...");
          console.log(e);
        this.imageLogoStr="";
        this.imageLogoURL="";
        this.imageLogoStr =String(e.target.result);
        this.imageLogoURL = this.imageLogoStr
        console.log('cccccc//ccc');
        this.rpcCall(this.imageLogoURL);
        //console.log(this.imageLogoStr.length);
      }
      onImageLogoChange(e){
            console.log(e);
            console.log(e.target.value);
            console.log(e.srcElement.value);

      try{
        var file=e.target.files[0];
     //  this.imageFile=e.target.files[0];
        this.logofr = new FileReader();
        this.logofr.onload = this.imageLogoProcessFile.bind(this);
        this.logofr.readAsDataURL(file);

      }
      catch(e)
      {
        //THIS EXCEPTION COMES WHEN USER DO NOT SELECT ANY FILE (CANCEL SELECTION)
        console.log("On File Change Error...");
        console.log(e);
      }
    }
    fileChange_New(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData:FormData = new FormData();
            console.log(file);
            console.log(file.name);
            formData.append('uploadFile', file,file.name);
            //formData.append("Hai","Hello");
            $.ajax({
                url: 'http://127.0.0.1:9980/getUserIP',
                type: 'POST',
                success: function (res) {
                   // your code after succes
                   console.log("SUCCESS");
                   console.log(res);
                },
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                /*async:true,
                xhr: function()
                {
                    var xhr = new XMLHttpRequest();
                    //Upload progress
                    xhr.upload.addEventListener("progress", function(evt){
                        if (evt.lengthComputable) {
                            var percentComplete = evt.loaded / evt.total;
                            //Do something with upload progress
                            console.log(percentComplete);
                        }
                    }, false);

                }*/
            });
            /*var  ajax= new XMLHttpRequest();
            ajax.upload.addEventListener("progress",this.progressHnadler,false);
            ajax.addEventListener("load",this.completeHandler,false);
            ajax.addEventListener("error",this.errorHandler,false);
            ajax.addEventListener("abort",this.abortHandler,false);
            let headers = new Headers();
            ajax.open("post","http://127.0.0.1:9980/getUserIP");
            //ajax.setRequestHeader("Content-Type","multipart/form-data");
            ajax.setRequestHeader("Content-Type",file.type);
            ajax.send(formData);*/
            //$("#tempForm").submit();


        }
    }
    progressHnadler(e){
        console.log("IN progressHnadler");
        console.log(e);
    }
    completeHandler(e){
        console.log("IN completeHandler");
        console.log(e);
    }
    errorHandler(e){
        console.log("IN errorHandler");
        console.log(e);
    }
    abortHandler(e){
        console.log("IN abortHandler");
        console.log(e);
    }
    fileChange(event) {
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData:FormData = new FormData();
            console.log(file);
            console.log(file.name);
            formData.append('uploadFile', file);

            let headers = new Headers();
            /** No need to include Content-Type in Angular 4 */
           // headers.append('Content-Type', 'multipart/form-data');
           // headers.append('Access-Control-Allow-Credentials','true');
            //headers.append('Accept', 'application/json');
            let options = new RequestOptions({ headers: headers });
            /*this.http.post("http://127.0.0.1:4000/tableData/storeVideoFiles"/*this.url.getURLForServerRPCCall()*, formData, *{headers:headers}*options)
            .map(res => {
                console.log("RESPONSE");
                console.log(res.json());
            })
            .catch((error: Response)=> {
                console.log(error.json());
                return [error.json()];
                //return Observable.throw(error.json())
              })
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            )*/
            //this.rpcCall(formData,options);
            /*this.http.post("http://127.0.0.1", formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error))
                .subscribe(
                    data => console.log('success'),
                    error => console.log(error)
                )*/
        }
    }
    rpcCall(data:any/*,options:RequestOptions*/){
        console.log("In RPC Call....");
        var content=
            {
              "methodName":"create",
              "role":this.storage.retrieve("role"),
              "CraftAirProductMgrName":this.storage.retrieve("productMgrName"),
              "CraftAirOrgMgrUUID":this.storage.retrieve("orgMgrUUID"),
              "CraftAirOrgMgrName":this.storage.retrieve("orgMgrName"),
              "params":data
            }
        var par = {
            "jsonrpc": "2.0",
            "method": "fileUpload",
            "id": String(new Date().getTime()),
            "params": content
        };
        console.log("Client RPC Service...");
        console.log(par);
        //console.log(data);
        const headers = new Headers({'Content-Type':'multipart/form-data'});
        //headers.append('Content-Type', 'multipart/form-data');
        this.http.post(/*"http://127.0.0.1:4000/tableData/storeVideoFiles"*/this.url.getURLForServerRPCCall(), JSON.stringify(par), {headers:headers}/*/options*/)
        //this.http.post("http://127.0.0.1:9980/getUserIP", data, {headers:headers}/*/options*/)
        .map(res => {
            console.log("RESPONSE");
            console.log(res);
        })
        .catch((error: Response)=> {
            console.log(error.json());
            return [error.json()];
            //return Observable.throw(error.json())
          })
        .subscribe(
            data =>{ console.log('success');console.log(data);},
            error => console.log(error)
        )
    }

      subcribeToFormChanges() {
        this.myForm.statusChanges.subscribe(x =>{
          //console.log(x);
            if((String(x)=="VALID")||(String(x)=="valid"))
            {
              //this.step1Validition=true;
            }
            else{
              //this.step1Validition=false;
            }
            });

      }
}
