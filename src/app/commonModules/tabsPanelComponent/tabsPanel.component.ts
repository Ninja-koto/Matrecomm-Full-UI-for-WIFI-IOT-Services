import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab.component';
import * as jQuery from "jquery";

@Component({
  selector: 'tabs-panel',
  template:
  `<div class="card">
    <!--<div class="card-header">
      
    </div>
    <div class="card-block">-->
    <div>
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
    '.card-block { height: 100%; overflow: hidden; }',
    //'.card-block:hover { overflow-y:auto; }',
    '.card-footer { background-color: #fff; border-top: 0 none; bottom: 0; left: 0; }',
    //'.nav-item { padding: 1rem 0rem; border-bottom: 0.5rem solid #ccc;}',
    '.nav-item { padding: 1rem 0rem;min-width:150px;height:50px;}',
    '.active { background-color: #359e91;color:#ffffff; margin-bottom: -1px;  /* background-color: #fff; */border: 1px solid #ddd;   border-bottom-color: transparent; font-weight: bold;  padding-top: 0;/*border-top: 5px solid #00BCD4;*/border-radius: 10px 10px 0 0; }',
    //'.active { margin-bottom: -1px;   background-color: #fff; border: 1px solid #ddd;   border-bottom-color: transparent; font-weight: bold; color: black; padding-top: 0;border-top: 5px solid #00BCD4;border-radius: 10px 10px 0 0; }',
    //'.enabled { max-width: 200px; color:#337ab7; cursor: pointer; border-bottom-color: rgb(88, 162, 234);display: inline-block;border: 1px solid #999;padding: 5px 10px;border-radius: 10px 10px 0 0; }',
    '.enabled { /*color:#337ab7;*/ cursor: pointer; display: inline-block; padding: 5px 10px;}',
    '.disabled { color: #ccc; }',
    '.completed { cursor: default; }'
  ]
})
export class TabsPanelComponent implements OnInit, AfterContentInit {
  @ContentChildren(TabComponent)
  wizardSteps: QueryList<TabComponent>;

  private _steps: Array<TabComponent> = [];
  private _isCompleted: boolean = false;
  private wizardHasNextStep: boolean = false;
  private wizardHasPrevStep: boolean = false;
  private prevButtonVisibility:string = "hidden";
  private nextButtonVisibility:string = "hidden";
  private completeButtonVisibility:string = "hidden";


  @Output()
  onTabChanged: EventEmitter<TabComponent> = new EventEmitter<TabComponent>();

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

  private get steps(): Array<TabComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  private get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): TabComponent {
    return this.steps.find(step => step.isActive);
  }

  private set activeStep(step: TabComponent) {
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

  goToStep(step: TabComponent) {
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
      let nextStep: TabComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
   
  }

  previous(event) {
    event.preventDefault();
    //console.log("In Previous..");
    if (this.hasPrevStep) {
      let prevStep: TabComponent = this.steps[this.activeStepIndex - 1];
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
