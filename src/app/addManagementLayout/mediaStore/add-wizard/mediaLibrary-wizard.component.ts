
import {Component,OnInit,ElementRef,Input , Output, EventEmitter} from "@angular/core"
import {BaThemeSpinner} from "../../../theme/services";
import { FormGroup, FormControl, FormBuilder, Validators, } from '@angular/forms';
import {Http, Headers,Response, RequestOptions} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";
import {Logger} from "../../../commonServices/logger";
import {SessionStorageService} from "ngx-webstorage";
import {UrlProvider} from "../../../commonServices/urlProvider";
import { CollectionTableDataCollectorService } from '../../../commonServices/tableDataCollector.service';
import {NameSpaceUtil} from "../../../commonServices/nameSpaceUtil";
import { FileUploader } from 'ng2-file-upload';

@Component({
    selector:"mediaLibrary-add",
    templateUrl:'./mediaLibrary-wizard.component.html',
    providers:[RPCService, CollectionTableDataCollectorService]
})

export class MediaLibraryAddWizardComponent implements OnInit {
    public myFormMediaLibrary: FormGroup;
    public myFormSelectMediaLibrary: FormGroup;

    step1Validition:boolean=false;
    step2Validition:boolean=false;

    addthumbnailStatus:string="Disable";
    addMediaFileStatus:string="Disable";

    mediaGenreTypes=['Movies','Songs','Serials'];
    mediaLanguages=['English','Hindi','Telugu','Kannada','Bhojpuri'];

selectedThumbnailFileName;
selectedThumbnailExt;
selectedFileName;
selectedFilenameExt;


    @Input() operation:String;
    @Input() data:any;
    @Output() closeModalWizard= new EventEmitter<string>();
    @Output() closeModal= new EventEmitter<string>();


    headers:Headers;
    thumbnail:String = "";
    mediaProgressStatus:Number=0;
    thumbnailProgressStatus:Number=0;
    fileName:String = "";
    uploadDate:String = "";
    size:Number;
    type:String = "";

    thumbnailFileName:String = "";
    thumbnailUploadDate:String = "";
    thumbnailSize:Number;
    thumbnailType:String = "";



    httpCall:XMLHttpRequest;
    uploadedFiles:any=[];
    selectFileErrmsg:String="";
    selectThumbnailFileErrmsg:string="";
    fileDataCollected:Boolean=false;

    selectedFilesList:FileList;
    selectedThumbnailFilesList:FileList;
    thumbFilelist:FileList;
    canProceedToUpload:Boolean=false;

    public uploader:FileUploader = new FileUploader({url: "http://127.0.0.1:4000/tableData/upload",
    additionalParameter:{"fileNS":"abc.xyz"}});
    nsObj:NameSpaceUtil;
    constructor(private _spinner:BaThemeSpinner,private _fb: FormBuilder, private el: ElementRef,
        private tableDataCollectService:CollectionTableDataCollectorService,
        private clientRpc: RPCService, private http:Http,private storage:SessionStorageService, private url:UrlProvider) {
     //   this._spinner.show();
        this.nsObj = new NameSpaceUtil(this.storage);
      }
      ngOnInit(){
        this.myFormMediaLibrary = this._fb.group({
            mediaStoreDescription:['',[Validators.required]],
            mediaStoreTitle:['',[Validators.required]],
        });
this.myFormSelectMediaLibrary= this._fb.group({

    adFile: ['', []],
    adThumbFile:['',[]],
    mediaStoreGenre:['',[Validators.required]],
    mediaStoreLanguage:['',[Validators.required]],
    });

        //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
        this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
        //overide the onCompleteItem property of the uploader so we are
        //able to deal with the server response.
        this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
            console.log("ImageUpload:uploaded:", item, status, response);
        };
        this.getUploadedFilesData();
        this.subcribeToFormChanges();
      }



      ngAfterViewInit(){
        //this._spinner.hide();
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
                //this.myForm.controls.adFile.reset();
                //this.myForm.reset();
                this.fileDataCollected=true;
             //   this._spinner.hide();
        });

        }
        catch(e)
        {
      //  this._spinner.hide();
        console.log("getUploadedFilesData Failed... ");
        }


      }

    checkNameAlreadyExist(e){
        console.log("In checkNameAlreadyExist")
        console.log(e);
        if(this.uploadedFiles!=undefined)
        {
            let found=false;
            for(let i=0;i<this.uploadedFiles.length;i++)
            {
                if(this.uploadedFiles[i].filename==e)
                {
                    found=true;
                    break;
                }
            }
            if(found) return true;
            else return false;
        }
        else
        return false;
    }
    getLocalTime(value){
    return String(new Date(value).toLocaleDateString())+", "+String(new Date(value).toLocaleTimeString());
    }

    imageLogoProcessFile(e){
        console.log('cccccc//ccc');
        console.log(e.target.result);
      }

    thumbnailFileChange_New(event) {
        console.log(event);
        let fileList: FileList = event.target.files;
        this.selectedThumbnailFilesList = fileList;
       console.log(this.selectedThumbnailFilesList);

       /*let logofr = new FileReader();
       logofr.onload = this.imageLogoProcessFile.bind(this);
       let file: File = fileList[0];
       logofr.readAsText(file);*/


        if(event.target.value!="")
        this.addthumbnailStatus="Enable";
       else
       this.addthumbnailStatus="Disable";

        if(this.addthumbnailStatus=="Enable" &&  this.addMediaFileStatus=="Enable")
            this.canProceedToUpload=true;
        else
            this.canProceedToUpload=false;
    }


    mediaFileChange_New(event) {
        console.log(event);
        let fileList: FileList = event.target.files;
        this.selectedFilesList = fileList;
        console.log('Selected file list');
        console.log(this.selectedFilesList);
      //  let status= this.canWeProceedToUpload();
        this.fileName = this.selectedFilesList[0].name;
        this.uploadDate = this.selectedFilesList[0].lastModifiedDate;
        this.size = this.selectedFilesList[0].size;
        this.type = this.selectedFilesList[0].type;
        if(event.target.value!="")
        this.addMediaFileStatus="Enable";
        else
        this.addMediaFileStatus="Disable";

        if(this.addthumbnailStatus=="Enable" &&  this.addMediaFileStatus=="Enable")
            this.canProceedToUpload=true;
        else
            this.canProceedToUpload=false;
    }


   canWeProceedToUpload(){
        //console.log("IN canWeProceed");
        //console.log(this.myForm.controls.fileName.value);
        let fileName=this.myFormMediaLibrary.controls.adFile.value;
        this.canProceedToUpload=false;
        let fileNameOk=false, selectFileOk=false;
        if(fileName==undefined)
        {
            this.myFormMediaLibrary.controls["adFile"].setErrors({"required":true});
            return false;
        }
        if(fileName=="")
            this.myFormMediaLibrary.controls["adFile"].setErrors({"required":true});
        else if(fileName.length<5)
            this.myFormMediaLibrary.controls["adFile"].setErrors({
                "minlength":{"requiredLength":5,"actualLength":fileName.length}
            });
        else
        {
            this.myFormMediaLibrary.controls["adFile"].setErrors(null);
            fileNameOk=true;
        }

        //console.log(this.selectedFilesList);
        if(this.selectedFilesList==undefined)
        {
            this.selectFileErrmsg="Please Select file";
            return false;
        }
        else
        {
            this.selectFileErrmsg="";
            selectFileOk=true;
        }
        if(fileNameOk&&selectFileOk)
            return true;
        else
            return false;
    }

    uploadFile(e){
        this.canProceedToUpload=false;

        let fileList=this.selectedFilesList;

        let thumbnailSelectList=this.selectedThumbnailFilesList;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData:FormData = new FormData();
            console.log('File check');
            console.log(file);
            console.log(file.name);
            let shortName = this.myFormSelectMediaLibrary.controls.adFile.value;
            let fileName = file.name;
           this.selectedFileName=file.name;
            console.log(fileName);
            let Ext = '.' + fileName.split('.')[fileName.split('.').length -1]
            let nameWithOutExt= fileName.substring(0,fileName.lastIndexOf("."));
            console.log(nameWithOutExt);
            let status = this.checkNameAlreadyExist(shortName+Ext);
            if(!status)
            {
                this.selectFileErrmsg="";
                let prodName = this.storage.retrieve("productMgrName");
                let orgId = this.storage.retrieve("orgMgrUUID");
                let name= nameWithOutExt+"_"+prodName+"_"+orgId;
                console.log(name+Ext);
                this.selectedFilenameExt=name+Ext;
                formData.append('file', file, name+Ext );

                this.httpCall= new XMLHttpRequest();
                this.httpCall.upload.addEventListener("progress",this.progressHandler.bind(this),false);
                this.httpCall.addEventListener("load",this.completeHandler.bind(this),false);
                this.httpCall.addEventListener("error",this.errorHandler.bind(this),false);
                this.httpCall.addEventListener("abort",this.abortHandler.bind(this),false);
                //let headers = new Headers();
                this.httpCall.open("post",this.url.getURLForDataRead()+"/tableData/upload"/*"http://127.0.0.1:4000/tableData/upload"*/);
                this.httpCall.send(formData);
             //   this._spinner.innerSpinShow();
            }
            else
            {
                console.log("Already available");
                this.selectFileErrmsg="A Media file exist with this name. Please enter different name";
         //       this.myFormSelectMediaLibrary.controls.adFile.reset();
            }
        }
        else
        {
            this.selectFileErrmsg="";
        }

        if(thumbnailSelectList.length > 0) {
            let file: File = thumbnailSelectList[0];
            let formData:FormData = new FormData();
            console.log(file);
            console.log(file.name);
            let shortName = this.myFormSelectMediaLibrary.controls.adThumbFile.value;
            let fileName = file.name;
            this.selectedThumbnailFileName=file.name;
            let Ext = '.' + fileName.split('.')[fileName.split('.').length -1]
            let nameWithOutExt= fileName.substring(0,fileName.lastIndexOf("."));

            let status = this.checkNameAlreadyExist(shortName+Ext);
            if(!status)
            {
                this.selectFileErrmsg="";
                let prodName = this.storage.retrieve("productMgrName");
                let orgId = this.storage.retrieve("orgMgrUUID");
                let name= nameWithOutExt+"_"+prodName+"_"+orgId;
                console.log(name+Ext);
                this.selectedThumbnailExt=name+Ext;
                formData.append('file', file, name+Ext );

                this.httpCall= new XMLHttpRequest();
                this.httpCall.upload.addEventListener("progress",this.thumbnailProgressHandler.bind(this),false);
                this.httpCall.addEventListener("load",this.thumbnailCompleteHandler.bind(this),false);
                this.httpCall.addEventListener("error",this.thumbnailErrorHandler.bind(this),false);
                this.httpCall.addEventListener("abort",this.thumbnailAbortHandler.bind(this),false);
                //let headers = new Headers();
                this.httpCall.open("post",this.url.getURLForDataRead()+"/tableData/upload"/*"http://127.0.0.1:4000/tableData/upload"*/);
                this.httpCall.send(formData);
           //     this._spinner.innerSpinShow();
            }
            else
            {
                console.log("Already available");
                this.selectThumbnailFileErrmsg="A Thumbnail file exist with this name. Please enter different name";
          //      this.myFormSelectMediaLibrary.controls.thumbnailFileName.reset();
            }
        }
        else
        {
            this.selectThumbnailFileErrmsg="";
        }


    }

    abortUpload(e){
        this.httpCall.abort();
    }
    progressHandler(e){
       // console.log("IN progressHnadler");
        //console.log(e);
        let percent = Math.round((e.loaded/e.total)*100);

        this.mediaProgressStatus= percent;
        //jQuery('#progressBar').value = Number(percent);
        //console.log(this.mediaProgressStatus);
    }
    thumbnailProgressHandler(e){
        // console.log("IN progressHnadler");
         //console.log(e);
         let percent = Math.round((e.loaded/e.total)*100);

         this.thumbnailProgressStatus= percent;
         //jQuery('#progressBar').value = Number(percent);
         //console.log(this.thumbnailProgressStatus);
     }

    completeHandler(e){
        console.log("IN completeHandler");
        console.log(e);
        this.getUploadedFilesData();
        this.selectedFilesList=undefined;
     //   this.myFormMediaLibrary.reset();
     //   this._spinner.innerSpinHide();
        //jQuery('#progressBar').value = 100;
    }

    thumbnailCompleteHandler(e){
        console.log("IN completeHandler");
        console.log(e);
        this.getUploadedFilesData();
        this.selectedThumbnailFilesList=undefined;
   //     this.myFormMediaLibrary.reset();
   //     this._spinner.innerSpinHide();
        //jQuery('#progressBar').value = 100;
    }


    errorHandler(e){
        console.log("IN errorHandler");
        console.log(e);
     //   this._spinner.innerSpinHide();
    }
   thumbnailErrorHandler(e){
        console.log("IN errorHandler");
        console.log(e);
  //     this._spinner.innerSpinHide();
    }

    abortHandler(e){
        console.log("IN abortHandler");
        console.log(e);
     //   this._spinner.innerSpinHide();
    }
    thumbnailAbortHandler(e){
        console.log("IN abortHandler");
        console.log(e);
   //     this._spinner.innerSpinHide();
    }

      subcribeToFormChanges() {
        this.myFormMediaLibrary.statusChanges.subscribe(x =>{
          //console.log(x);
            if((String(x)=="VALID")||(String(x)=="valid"))
            {
            this.step1Validition=true;
            }
            else{
             this.step1Validition=false;
            }
            });
            this.myFormSelectMediaLibrary.statusChanges.subscribe(x =>{
                //console.log(x);
                  if((String(x)=="VALID")||(String(x)=="valid"))
                  {
                  this.step2Validition=true;
                  }
                  else{
                   this.step2Validition=false;
                  }
                  });


      }
      convertBytesToMegaBytes(data:any)
      {
        if((data!=undefined)&&(data!=undefined))
        {
          let packetCount = Number(data);
          var ext="";
          data = (packetCount)/1024; //KB
          ext=" KB";
          //console.log("Data : "+data);
          data = Math.round(data);
          var dataStr="0";
          if( (ext==" KB")&&(data>1024) )
          {
              data = data/1024; //MB
              //data = Math.round(data);
              dataStr= data.toFixed(3);
              ext=" MB";
          }
          else
          {
            dataStr= data.toFixed(3);
            ext=" KB";
          }
          if( (ext==" MB")&&(data>1024) )
          {
              data = data/1024; //MB
              dataStr = data.toFixed(3);
              ext=" GB";
          }
          return String(dataStr)+ext;
        }
        else
          return "0 KB";
      }


gotoFinalSubmit(val: any) {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    //Collect all data from each step

    let myFormMediaLibraryData = this.myFormMediaLibrary.value;
    let myFormSelectMediaLibraryData = this.myFormSelectMediaLibrary.value;


    console.log(myFormMediaLibraryData);
    console.log(myFormSelectMediaLibraryData);

  console.log("Form 3 Data...");

     var FinalJSON = {};


     FinalJSON["mediaTitle"] = myFormMediaLibraryData.mediaStoreTitle;
     FinalJSON["mediaDescription"] = myFormMediaLibraryData.mediaStoreDescription;
     FinalJSON["selectedMediaFilename"] = this.selectedFileName;
     FinalJSON["selectedMediaFilenameExt"] = this.selectedFilenameExt;
     FinalJSON["selectedThumbnailFilename"] = this.selectedThumbnailFileName;
     FinalJSON["selectedThumbnailFileExt"] = this.selectedThumbnailExt;
     FinalJSON["selectedMediaGenre"] =myFormSelectMediaLibraryData.mediaStoreGenre;
     FinalJSON["selectedMediaLanguage"] = myFormSelectMediaLibraryData.mediaStoreLanguage;



    let finalData = jQuery.extend(FinalJSON, { "date": new Date().toISOString() });
    var op;
    if (this.operation == "Add")
      op = "create";
    else {
      op = "update";
      finalData = jQuery.extend(finalData, { "uuid": this.data });
    }
    console.log("Final Data");
    console.log(finalData);
    this.clientRpc.orgRPCCall('create', "orgManagerMediaStoreProfileMethod", finalData)
      .subscribe(res => {
        console.log("OUTPUT...");
        console.log(res);
        let log = new Logger();
        if (String(res.type) == "undefined") {
          //log.storeFailNotification("Modify in UserRegistration Failed");
          try {
            if ((res.result.status == "Success") || (res.result.Status == "Success")) {
              console.log("Trigger reload Event....");
              log.storeSuccessNotification("In Media Management " + this.operation + " succeeded");
            }
            else {
              log.storeFailNotification("In Media Management " + this.operation + " Failed");
              console.log("Do Nothing....");
            }
          }
          catch (e) { }
        }
        else {
          if (String(res.type) == "error") {
            log.storeFailNotification("In Media Management " + this.operation + " Failed");
          }
        }
        this.closeModal.emit("yes");
        this.closeModalWizard.emit(val);
      });
    

}


}
