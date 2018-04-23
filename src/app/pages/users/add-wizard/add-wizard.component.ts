import { Component, OnInit,AfterContentInit, Input , Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Http, Headers} from "@angular/http";

@Component({
  selector: 'app-add-wizard',
  templateUrl: './add-wizard.component.html',
  styleUrls: ['./add-wizard.component.css']
})

export class AddWizardComponent implements OnInit {
    public myForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
  step1Validition:boolean=false;
  public user: any;

  @Input() operation:string;
  @Input() data:any;
  @Output() closeModalWizard= new EventEmitter<string>();
  @Output() closeModal= new EventEmitter<string>();
  headers:Headers;
    constructor(private _fb: FormBuilder,private http:Http) {
    
     }

    ngOnInit() {
        // the long way
        // this.myForm = new FormGroup({
        //     name: new FormControl('', [<any>Validators.required, <any>Validators.minLength(5)]),
        //     address: new FormGroup({
        //         address1: new FormControl('', <any>Validators.required),
        //         postcode: new FormControl('8000')
        //     })
        // });

        // the shor(t way
        console.log("Operation : "+this.operation);
        console.log(this.data);
        this.myForm = this._fb.group({
              name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
              address: this._fb.group({
                  street: ['', <any>Validators.required],
                  postcode: ['']
              })
          });
        this.subcribeToFormChanges();

        if(this.operation=="Add")
        {
          
        }
        
        // Update single value
        /*(<FormControl>this.myForm.controls['address'])
            .setValue("Hyderabad",{onlySelf: true });*/
        if(this.operation=="Modify")
        {
          /*(<FormControl>this.myForm.controls['name'])
              .setValue('John123', { onlySelf: true });
          (<FormGroup>this.myForm.controls['address'])
            .setValue({'street':'abcd','postcode':'9000'});*/
           (<FormGroup>this.myForm)
             .setValue(this.data, { onlySelf: true });
          this.step1Validition=true;
        }
            
        
        // Update form model
        // const people = {
        // 	name: 'Jane',
        // 	address: {
        // 		street: 'High street',
        // 		postcode: '94043'
        // 	}
        // };
        
        // (<FormGroup>this.myForm)
        //     .setValue(people, { onlySelf: true });

    }
    		ngAfterViewInit		(){

      }
    subcribeToFormChanges() {
      this.myForm.statusChanges.subscribe(x =>{
        console.log(x);
          if((String(x)=="VALID")||(String(x)=="valid"))
            this.step1Validition=true;
          else
            this.step1Validition=false;
          });
        //const myFormStatusChanges$ = this.myForm.statusChanges;
        //const myFormValueChanges$ = this.myForm.valueChanges;
        //myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        //myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }
    
    /*save(model: User, isValid: boolean) {
        this.submitted = true;
        console.log(model, isValid);
    }*/

  gotoFinalSubmit(val:any)
  {
    console.log("Final Submit in add-wizard....");
    console.log(val);
    var abc={}
      abc["methodName"]="abc";
      var par = {
          "jsonrpc": "2.0",
          "method": "getApps",
          "id": String(new Date().getTime()),
          "params": abc
      };

      var xhrC = new XMLHttpRequest();

      xhrC.onreadystatechange = function() {
          if (xhrC.readyState==4 && xhrC.status==200) {
              console.log("GEt Apps REsponse....");
              console.log(xhrC.response);
          }
      }
this.headers = new Headers({
    'Content-Type': 'application/json; charset=UTF-8'
  });
      var serIP= "localhost:8383";
      xhrC.open('POST', 'http://'+serIP, true);
      xhrC.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhrC.send(JSON.stringify(par));
      
      
      /*this.http.post("localhost:8383",JSON.stringify(par),{headers: this.headers}).subscribe(result=>{
        console.log(result);
      })*/
      






    //Collect all data from each step
    this.closeModal.emit("yes");
    this.closeModalWizard.emit(val);
    console.log(this.myForm.value);
    //this.myForm.reset();
  }
}
