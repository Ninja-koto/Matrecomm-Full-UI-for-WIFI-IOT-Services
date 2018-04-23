import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { DashTabComponent } from './dashTab.component';
import * as jQuery from "jquery";

@Component({
  selector: 'dash-tabs-panel',
  template:
  `<div class="card">
    <!--<div class="card-header" style="background-color: #9edff8;color: #000;padding: 5px;">
          <div class="row col-md-12">
            <div style="width: 50%;float:left;">
            {{dataToDisplay1}}
            </div>
            <div style="width: 50%;float:right;">
              {{dataToDisplay2}}
            </div>
          </div>
    </div>-->
    <div >
    <ul class="nav nav-justified" style="height:50px;border-bottom: 1px solid #ddd;">
        <li class="nav-item " [ngStyle]="{'max-width':step.maxStepWidth}" (click)="goToStep(step)" *ngFor="let step of steps" [ngClass]="{'active': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled, 'completed': isCompleted}">
            <a   class="spanCls" title="{{step.title}}"><i [ngClass]="step.tabIcon" aria-hidden="true"></i>&nbsp;&nbsp;{{step.title}}</a>
        </li>
      </ul>
      <ng-content></ng-content>
    </div>
  </div>`
  ,
  styles: [
    '.card { margin-bottom: -10px;overflow-x: auto;  height: 100%;-webkit-box-shadow: 0 5px 15px rgba(0,0,0,0);-moz-box-shadow: 0 5px 15px rgba(0,0,0,0);-o-box-shadow: 0 5px 15px rgba(0,0,0,0);box-shadow: 0 5px 15px rgba(0,0,0,0); }',
    '.spanCls {display:inline-block;white-space: nowrap;overflow:hidden !important;text-overflow: ellipsis; margin-top:10px;}',
    '.tooltip {position: relative;border-bottom: 1px dotted black;}',
    '.tooltip .tooltiptext {width: 120px;background-color: black;color: #fff;text-align: center;border-radius: 6px;padding: 5px 0;}',
    '.tooltip .tooltiptext {visibility: visible;}',
    '.card-header { background-color: #fff; padding: 0; "}',
    '.card-block { height: 100%; /*overflow: hidden; */}',
    //'.card-block:hover { overflow-y:auto; }',
    '.card-footer { background-color: #fff; border-top: 0 none; bottom: 0; left: 0; }',
    //'.nav-item { padding: 1rem 0rem; border-bottom: 0.5rem solid #ccc;}',
    '.nav-item { padding: 1rem 0rem;min-width:150px;height:50px;}',
    '.active { background-color: #9edff8;color:#ffffff; margin-bottom: -1px;  /* background-color: #fff; */border: 1px solid #ddd;   border-bottom-color: transparent; font-weight: bold;  padding-top: 0;/*border-top: 5px solid #00BCD4;*/border-radius: 10px 10px 0 0; }',
    //'.enabled { max-width: 200px; color:#337ab7; cursor: pointer; border-bottom-color: rgb(88, 162, 234);display: inline-block;border: 1px solid #999;padding: 5px 10px;border-radius: 10px 10px 0 0; }',
    '.enabled { cursor: pointer; display: inline-block; padding: 5px 10px;}',
    '.disabled { color: #ccc; }',
    '.completed { cursor: default; }'
  ]
})
export class DashTabsPanelComponent implements OnInit, AfterContentInit {
  @ContentChildren(DashTabComponent)
  wizardSteps: QueryList<DashTabComponent>;

  private _steps: Array<DashTabComponent> = [];
  private _isCompleted: boolean = false;
  private wizardHasNextStep: boolean = false;
  private wizardHasPrevStep: boolean = false;
  private prevButtonVisibility:string = "hidden";
  private nextButtonVisibility:string = "hidden";
  private completeButtonVisibility:string = "hidden";

  @Input() dataToDisplay1:any="";
  @Input() dataToDisplay2:any="";
  @Output()
  onTabChanged: EventEmitter<DashTabComponent> = new EventEmitter<DashTabComponent>();

  @Output() finalSubmit = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

  ngOnDestory(){
    console.log("OnDestroy wizard Component...")
  }

  ngAfterContentInit() {
    this.wizardSteps.forEach(step => this._steps.push(step));
    this.steps[0].isActive = true;
  }

  private get steps(): Array<DashTabComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  private get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): DashTabComponent {
    return this.steps.find(step => step.isActive);
  }

  private set activeStep(step: DashTabComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onTabChanged.emit(step);
    }
  }

  private get activeStepIndex(): number {
    return this.steps.indexOf(this.activeStep);
  }

  private get hasNextStep(): boolean {
    //console.log(this.activeStepIndex < this.steps.length - 1);    
    return this.activeStepIndex < this.steps.length - 1;
  }

  private get hasPrevStep(): boolean {
    //console.log(this.activeStepIndex);
    return this.activeStepIndex > 0;
  }

  goToStep(step: DashTabComponent) {
    //console.log("this.isCompleted");
    //console.log(this.isCompleted);
    if (!this.isCompleted) {
      //console.log("")
      this.activeStep = step;
    }
  }
  

  next(event) {
    event.preventDefault();
    if (this.hasNextStep) {
      let nextStep: DashTabComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
   
  }

  previous(event) {
    event.preventDefault();
    //console.log("In Previous..");
    if (this.hasPrevStep) {
      let prevStep: DashTabComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
    
  }

  complete(event) {
    event.preventDefault();
    if(this.activeStepIndex == this.steps.length - 1)
    {
      //console.log(this.activeStepIndex);
      this.activeStep.onComplete.emit();
      this._isCompleted = true;
      jQuery('.card-footer>button').prop("disabled",true);
      this.finalSubmit.emit("Success");

      //To Restore back to Initial Wizard...
      jQuery('.card-footer>button').prop("disabled",false);
      this.steps.forEach(step=>{step.isActive=false;step.isDisabled=true;});
      this._isCompleted = false;
      this.steps[0].isActive = true;
      this.steps[0].isDisabled = false;
      this.activeStep= this.steps[0];
      
    }
    else
    {
      //console.log("Not Completed...");
    }
  }

}
