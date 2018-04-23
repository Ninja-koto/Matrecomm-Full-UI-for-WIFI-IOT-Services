
import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers,Response} from "@angular/http";
import "rxjs/Rx";
import {Observable} from "rxjs";
import * as jQuery from "jquery";
import {RPCService} from "../../../commonServices/RPC.service";
import {CustomValidator} from "../../../commonServices/customValidator.service";
import {Logger} from "../../../commonServices/logger";
import {SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'profileCreation-add-wizard',
  templateUrl: './ProfileCreation-wizard.component.html',
  styleUrls: ['./ProfileCreation-wizard.component.scss'],
  providers:[RPCService]
})

export class ProfileMediaAddWizardComponent implements OnInit {
    public myFormProfile: FormGroup;
    public myFormProfileMovies: FormGroup;
    public myFormProfileSerials: FormGroup;
    public myFormProfileSongs: FormGroup;

    public submitted: boolean;
    public events: any[] = [];

    step1Validition:boolean=false;
    step2Validition:boolean=true;
    step3Validition:boolean=true;
    step4Validition:boolean=true;

sourceMovies=[];
targetMovies = [];

targetSerials=[];
sourceSerials=[];

targetSongs = [];
sourceSongs=[];

  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Input() allMoviesData:any=[];
  @Input() allSongsData:any=[];
  @Input() allSerialsData:any=[];


  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;

   mediaSongsSelectedData=[];
   mediaMoviesSelectedData=[];
   mediaSerialsSelectedData=[];

    constructor(private storage:SessionStorageService,private _fb: FormBuilder, private clientRpc: RPCService, private http:Http) {
     }

    ngOnInit() {

        this.myFormProfile = this._fb.group({
              profileName: ['', [Validators.required]],
        });
           this.myFormProfileMovies = this._fb.group({
            mediaMovies: ['', [Validators.required]],
        });
        this.myFormProfileSerials = this._fb.group({
          mediaSerials: [[],[Validators.required]],
        });
        this.myFormProfileSongs = this._fb.group({
          mediaSongs: [[],[Validators.required]],
        });

    this.mediaSongsSelectedData=this.allSongsData;
    this.mediaMoviesSelectedData=this.allMoviesData;
    this.mediaSerialsSelectedData=this.allSerialsData;

        this.subcribeToFormChanges() ;


        if(this.operation=="Add")
        {

        }

        if(this.operation=="Modify")
        {
          (<FormControl>this.myFormProfile.controls['profileName'])
          .setValue(this.data.profileName, { onlySelf: true });
            let tempUUID=[],locs=[];
            locs=this.data.files;
            console.log(locs);
            locs.forEach(element => {
              tempUUID.push(element.id);
            });
          (<FormControl> this.myFormProfile.controls["files"])
            .setValue(tempUUID, { onlySelf: true });
          this.step1Validition=true;
        }

    }
    subcribeToFormChanges() {
      this.myFormProfile.statusChanges.subscribe(x =>{
        //console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
          this.myFormProfileMovies.statusChanges.subscribe(x =>{

              });
          this.myFormProfileSerials.statusChanges.subscribe(x =>{

              });
          this.myFormProfileSongs.statusChanges.subscribe(x =>{

              });


            }


        onPageLoadMediaMovies(e)
        {
          console.log("In pageLoaded");
          console.log(e);
          if($.trim(e)=="Media Movies")
            {
              console.log("Media Movies Details ");
              for(var i = 0; i < this.mediaMoviesSelectedData.length; i++) {
                  let uploadFileName= $.trim(this.mediaMoviesSelectedData[i].selectedMediaFilename);
                     this.sourceMovies.push(uploadFileName);
                }
            }
          }
          onPageLoadMediaSerials(e)
          {
            console.log("In pageLoaded");
            console.log(e);
            if($.trim(e)=="Media Serials")
              {
                console.log("Media Serials Details ");
                for(var i = 0; i < this.mediaSerialsSelectedData.length; i++) {
                    let uploadFileName= $.trim(this.mediaSerialsSelectedData[i].selectedMediaFilename);
                       this.sourceSerials.push(uploadFileName);
                  }
              }
            }
            onPageLoadMediaSongs(e)
            {
              console.log("In pageLoaded");
              console.log(e);
              if($.trim(e)=="Media Songs")
                {
                  console.log("Media Songs Details ");
                  for(var i = 0; i < this.mediaSongsSelectedData.length; i++) {
                    console.log(this.mediaSongsSelectedData[i]);
                      let uploadFileName= $.trim(this.mediaSongsSelectedData[i].selectedMediaFilename);
                         this.sourceSongs.push(uploadFileName);
                    }
                }
              }


    		ngAfterViewInit	(){

      }

  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);

    let selectedMoviesArray =[];
    for(let i=0;i<this.targetMovies.length;i++)
    {
      let selectedMovies ={};
      console.log(this.targetMovies[i]);
      selectedMovies["selectedMovieName"]=this.targetMovies[i];
      selectedMoviesArray.push(selectedMovies);
    }

    let selectedSerialsArray =[];
    for(let i=0;i<this.targetSerials.length;i++)
    {
      let selectedSerials ={};
      console.log(this.targetSerials[i]);
      selectedSerials["selectedSerialName"]=this.targetSerials[i];
      selectedSerialsArray.push(selectedSerials);
    }

    let selectedSongsArray =[];
    for(let i=0;i<this.targetSongs.length;i++)
    {
      let selectedSongs ={};
      console.log(this.targetSongs[i]);
      selectedSongs["selectedSongName"]=this.targetSongs[i];
      selectedSongsArray.push(selectedSongs);
    }



    var FinalJson = {};

    FinalJson["profileName"] = this.myFormProfile.controls.profileName.value;
    FinalJson["selectedMovieGroup"] = selectedMoviesArray;
    FinalJson["selectedSerialGroup"] = selectedSerialsArray;
    FinalJson["selectedSongsGroup"] = selectedSongsArray;


    let finalData = jQuery.extend(FinalJson,{"date":new Date().toISOString()});
  var op;
  if(this.operation=="Add")
    op="create";
  else
  {
    op="update";
    finalData = jQuery.extend(finalData,{"uuid":this.data.uuid});
  }
  console.log("final data");
  console.log(finalData);

  console.log("Entering RPC");
  this.clientRpc.orgRPCCall(op,"orgManagerMediaProfileCreationMethod",finalData)
        .subscribe(res =>{
        console.log("OUTPUT...");
        console.log(res);
        let log = new Logger();
        if(String(res.type)=="undefined")
        {
          //log.storeFailNotification("Modify in UserRegistration Failed");
          try{
          if((res.result.status=="Success")||(res.result.Status=="Success"))
          {
            console.log("Trigger reload Event....");
            log.storeSuccessNotification("In Media Management "+this.operation+" succeeded");
          }
          else
          {
            log.storeFailNotification("In Media Management "+this.operation+" Failed");
            console.log("Do Nothing....");
          }
          }
          catch(e){}
        }
        else
        {
          if(String(res.type)=="error")
          {
            log.storeFailNotification("In Media Management "+this.operation+" Failed");
          }
        }
      });
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);

  }
}
