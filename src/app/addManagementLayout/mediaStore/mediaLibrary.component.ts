import { Component ,OnInit, ViewChild, ViewContainerRef, AfterViewChecked, ViewEncapsulation} from '@angular/core';
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
import { ModalComponent } from 'ng2-bs4-modal/ng2-bs4-modal';
import {AddWizardComponent} from "./add-wizard/add-wizard.component";


@Component({
  selector: 'mediaLibrary',
  templateUrl: 'mediaLibrary.component.html',
  providers:[RPCService, CollectionTableDataCollectorService],
  encapsulation: ViewEncapsulation.None
})
export class mediaLibrary implements OnInit {
    tableData :any;
    deleteParams:any={};

    userFilter: any = {};

    @ViewChild('modal')
    modal: ModalComponent;
    //model: AddPerson = new AddPerson();

     index: number = 0;
    backdropOptions = [true, false, 'static'];
    cssClass: string = '';

    animation: boolean = true;
    keyboard: boolean = false;
    backdrop: string | boolean = 'static';
    css: boolean = false;

    selected: string;
    output: string;


    currWizardOp:string;
    currWizardData:any;
    addWizard:boolean=false;
    modifyWizard:boolean=false;
    rowsOnEachPage=5;
    replaceWithNewData=false;

   // eraseModal:boolean = false;
    interValID:any;
    lastUpdatedTime:number;
    deleteParamForSelected:any;


    uploadedFiles:any=[];
    selectFileErrmsg:String="";
    fileDataCollected:Boolean=false;
    selectedFilesList:FileList;
    canProceedToUpload:Boolean=false;
    httpCall:XMLHttpRequest;
    nsObj:NameSpaceUtil;
    showWizard=false;

    namespace:string="";
    config:any={};
  constructor(private _spinner:BaThemeSpinner,
              private tableDataCollectService:CollectionTableDataCollectorService,
              private clientRpc: RPCService, private http:Http,private storage:SessionStorageService,
              private url:UrlProvider,
              vcRef: ViewContainerRef) {
              this._spinner.show();
              this.nsObj = new NameSpaceUtil(this.storage);
              this.lastUpdatedTime = new Date().getTime();
           }


      clickedWizardButtonID(val :string)
      {
        console.log("Clicked Wizard Operation ID...");
        console.log(val);
      }


      selectedRowData(val:any)
      {
        console.log("selectedRowData...");
        console.log(val);
        //this.resetClock()
        this.currWizardData=val;
        this.deleteParamForSelected={"uuid":this.currWizardData.uuid};
      }
      selectedWizardOperation(val:string)
      {
        console.log("selectedWizardOperation...");
        console.log(val);
        this.currWizardOp=val;
        if(val=="Add")
        {
          this.addWizard=true;
          this.modifyWizard=false;
        }
        else if(val=="Modify")
        {
          this.addWizard=false;
          this.modifyWizard=true;
        }
        else
        {
          this.addWizard=false;
          this.modifyWizard=false;
        }
      }

      closed() {
        console.log("Trying to close...");
          //this.output = '(closed) ' + this.selected;

      }

      close1(){
        //setTimeout(function() {
          console.log("Event caught to replace Table data....");
          console.log("In close1...");
          this._spinner.hide();
          this.getUploadedFilesData();  
        //}.bind(this), 2000);
        
        }
        dismissed() {
          console.log("dismissed...");
          this.showWizard=false;
            this.output = '(dismissed)';
            this._spinner.hide();
            this.getUploadedFilesData();
        }
        closeWizard(){
          console.log("In Close Wizard...");
          this.showWizard=false;
          this._spinner.hide();
          this.getUploadedFilesData();
        }
        showUploadWizard(){
          console.log("IN show upload wizard")
          this.showWizard=true;
        }
        opened() {
            this.output = '(opened)';
        }
      open() {
        //this.modal.open();
    }


ngOnInit(){
 this.getUploadedFilesData();
 //this.readUploadedImageFile();
}

readUploadedImage(file:any){
  //console.log('File check');
  //console.log(file);
  try{
      
      //this._spinner.innerSpinShow();
      var paramsForData={};
      let query={}, projectQuery={};
      paramsForData["projectQuery"]=projectQuery;
      paramsForData["dataQuery"]= query;
      paramsForData["namespace"]= this.nsObj.getNameSpace("uploads");
      paramsForData["filename"] = file.selectedThumbnailFilename;
      paramsForData["limit"]=-1;
      console.log(paramsForData);

      this.tableDataCollectService.readUploadedImageFile(paramsForData)
          .subscribe(result => {
              var res = result;//json();
              //console.log("read files");
              //console.log(res);
              let data = res["_body"];
              file["img"]=data;  
              return file;
              /*var file = new Blob([data]);
              var fileURL = URL.createObjectURL(file);
              console.log(fileURL);*/
              //this._spinner.innerSpinHide();
      });
      console.log("REQ SENT");
      console.log(new Date());
    }
    catch(e){}

}

getAllImageFiles(){
    this.uploadedFiles.forEach(element => {
      element["img"]="assets/img/cardImage.jpg";
      element= this.readUploadedImage(element);
    });
}

getUploadedFilesData(){
    console.log("In getUploadedFilesData");
    console.log(new Date());

        try{

        var paramsForData={};
        let query={}, projectQuery={};
        paramsForData["projectQuery"]=projectQuery;
        paramsForData["dataQuery"]= query;
        paramsForData["namespace"]= this.nsObj.getNameSpace("MediaStore");
        paramsForData["limit"]=-1;
        console.log(paramsForData);

        this.tableDataCollectService.getPostData(paramsForData)
            .subscribe(result => {
                var res = result;//json();
                console.log("Media Store Files");
                console.log(res.data);
                if(res!=undefined)
                {
                if(res.data==undefined)
                    this.uploadedFiles=[];
                else
                {
                    this.uploadedFiles=res.data
                    this.getAllImageFiles();
                 
                    this.userFilter = { selectedMediaFilename: '' };

                }
                }
                else
                    this.uploadedFiles=[];
                console.log(this.uploadedFiles);
            //    console.log(this.uploadedFiles[0].filename);
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
       deleteFile(file){
        console.log(file);
        try{
           let filename =file.selectedMediaFilename;
           console.log(filename);
            this._spinner.innerSpinShow();
            var paramsForData={};
            let query={}, projectQuery={};
            paramsForData["projectQuery"]=projectQuery;
            paramsForData["dataQuery"]= query;
            paramsForData["namespace"]= this.nsObj.getNameSpace("uploads");
            paramsForData["limit"]=-1;
            paramsForData["filename"]=filename;
            console.log(paramsForData);

            this.tableDataCollectService.deleteUploaded(paramsForData)
                .subscribe(result => {
                    var res = result;//json();
                    console.log("Delete filename Res");
                    console.log(res);
                    this._spinner.innerSpinHide();
            });

            try{
              let filename =file.selectedThumbnailFilename;
              console.log(filename);

               this._spinner.innerSpinShow();
               var paramsForData={};
               let query={}, projectQuery={};
               paramsForData["projectQuery"]=projectQuery;
               paramsForData["dataQuery"]= query;
               paramsForData["namespace"]= this.nsObj.getNameSpace("uploads");
               paramsForData["limit"]=-1;
               paramsForData["filename"]=filename;
               console.log(paramsForData);

               this.tableDataCollectService.deleteUploaded(paramsForData)
                   .subscribe(result => {
                       var res = result;//json();
                       console.log("Delete Thumbnail Res");
                       console.log(res);
                       this._spinner.innerSpinHide();
               });
           }
           catch(e)
           {
               console.log("deleteUploaded thumbnail File Failed... ");
               this._spinner.innerSpinHide();
           }
         }
        catch(e)
        {
            console.log("deleteUploaded File Failed... ");
            this._spinner.innerSpinHide();
        }

     try{
        let uuid =file.uuid;
         this._spinner.innerSpinShow();
         var paramsForData={};
         let query={}, projectQuery={};
         this.deleteParams={"uuid":uuid};
         this.clientRpc.orgRPCCall("delete","orgManagerMediaStoreProfileMethod",this.deleteParams)
         .subscribe(res =>{
         console.log("OUTPUT...");
         console.log(res);
         let log = new Logger();
         let status="success";
         if(String(res.type)=="undefined")
         {
           //log.storeFailNotification("Modify in UserRegistration Failed");
           try{
             console.log(res);
             if((res.result.status=="Success")||(res.result.Status=="Success"))
             {
               status="success";
               console.log("Trigger reload Event....");
               this._spinner.hide();
               
             }
             else
             {
               status="failed";
               console.log("Do Nothing....");
             }
           }
           catch(e){}
         }
         else
         {
           if(String(res.type)=="error")
           {
             status="failed";
           }
         }
         this.getUploadedFilesData();
         if(status=="success"){
           log.storeSuccessNotification(" Delete Succeeded");
         }
         else{
           log.storeFailNotification("Delete Failed");
         }
         this._spinner.hide();
         //this.getUploadedFilesData();

       });

     }
     catch(e)
     {
         console.log("delete Media Store File Failed... ");
         this._spinner.innerSpinHide();
     }

    }

    editFile(file,e){
      e.preventDefault();
      console.log(file);
    }
    getFileInfo(file,e){
      e.preventDefault();
      console.log(file);
    }
    getDateFormat(date)
    {
      try{
      return new Date(date).toLocaleDateString()+" "+new Date(date).toLocaleTimeString();
      }
      catch(e)
      {
        return "";
      }
    }



  ngAfterViewInit() {
    this._spinner.hide();
  }







}
