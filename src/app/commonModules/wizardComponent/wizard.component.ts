import { Component, OnInit, OnDestroy, Output, Input, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { WizardStepComponent } from './wizard-step.component';
import * as jQuery from "jquery";

@Component({
  selector: 'form-wizard',
  template:
  `<div class="card">
    <div class="card-header">
      <ul class="nav nav-justified" >
        <li class="nav-item " style="margin-top: -20px;height: 55px;" *ngFor="let step of steps" [ngClass]="{'active': step.isActive, 'enabled': !step.isDisabled, 'disabled': step.isDisabled, 'completed': isCompleted}">
            <!--<a (click)="goToStep(step)" [ngStyle]="{'max-width':step.maxStepWidth}" class="spanCls" title="{{step.title}}">{{step.title}}</a>-->
            <span [ngStyle]="{'max-width':step.maxStepWidth}" class="spanCls" title="{{step.title}}">{{step.title}}</span>
        </li>
      </ul>
    </div>
    <div class="card-block">
      <ng-content></ng-content>
    </div>
    <div class="card-footer">
    <!--<div class="card-footer" [hidden]="isCompleted">-->
        <button type="button" class="btn btn-primary float-left" (click)="previous($event)" [ngStyle]="{'visibility':prevButtonVisibility}">Previous</button>
        <button type="button" class="btn btn-primary float-right" (click)="next($event)" [disabled]="!activeStep.isValid" [ngStyle]="{'visibility':nextButtonVisibility}">Next</button>
        <button type="button" class="btn btn-primary float-right" (click)="complete($event)" [disabled]="!activeStep.isValid" [ngStyle]="{'visibility':completeButtonVisibility}">Submit</button>
    </div>
  </div>`
  ,
  styles: [
    '.card { margin-bottom: -10px; height: 100%;-webkit-box-shadow: 0 5px 15px rgba(0,0,0,0);-moz-box-shadow: 0 5px 15px rgba(0,0,0,0);-o-box-shadow: 0 5px 15px rgba(0,0,0,0);box-shadow: 0 5px 15px rgba(0,0,0,0); }',
    '.spanCls {display:inline-block;white-space: nowrap;overflow:hidden !important;text-overflow: ellipsis;}',
    '.tooltip {position: relative;border-bottom: 1px dotted black;}',
    '.tooltip .tooltiptext {width: 120px;background-color: black;color: #fff;text-align: center;border-radius: 6px;padding: 5px 0;}',
    '.tooltip .tooltiptext {visibility: visible;}',
    '.card-header { background-color: #fff; padding: 0; "}',
    '.card-block { height: 350px; overflow: hidden; }',
    '.card-block:hover { overflow-y:auto; }',
    '.card-footer { background-color: #fff; border-top: 0 none; bottom: 0; left: 0; }',
    '.nav-item { padding: 1rem 0rem; border-bottom: 0.5rem solid #ccc; }',
    '.active { font-weight: bold; color: black; border-bottom-color: /*#1976D2,#ea4823*/#82a21d !important; }',
    '.enabled { cursor: pointer; border-bottom-color: #d4ef7e /*#f79d88 ,rgb(88, 162, 234)*/; }',
    '.disabled { color: #ccc; }',
    '.completed { cursor: default; }'
  ]
})
export class WizardComponent implements OnInit, AfterContentInit {
  @ContentChildren(WizardStepComponent)
  wizardSteps: QueryList<WizardStepComponent>;

  private _steps: Array<WizardStepComponent> = [];
  private _isCompleted: boolean = false;
  private wizardHasNextStep: boolean = false;
  private wizardHasPrevStep: boolean = false;
  private prevButtonVisibility:string = "hidden";
  private nextButtonVisibility:string = "hidden";
  private completeButtonVisibility:string = "hidden";


  @Output()
  onStepChanged: EventEmitter<WizardStepComponent> = new EventEmitter<WizardStepComponent>();

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
    this.steps[0].onLoad.emit(this.steps[0].title);
    this.setButtonsVisibility()
  }

  private get steps(): Array<WizardStepComponent> {
    return this._steps.filter(step => !step.hidden);
  }

  private get isCompleted(): boolean {
    return this._isCompleted;
  }

  private get activeStep(): WizardStepComponent {
    return this.steps.find(step => step.isActive);
  }

  private set activeStep(step: WizardStepComponent) {
    if (step !== this.activeStep && !step.isDisabled) {
      this.activeStep.isActive = false;
      step.isActive = true;
      this.onStepChanged.emit(step);
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

  goToStep(step: WizardStepComponent) {
    console.log("this.isCompleted");
    console.log(this.isCompleted);
    if (!this.isCompleted) {
      console.log("")
      this.activeStep = step;
    }
    this.setButtonsVisibility()
  }
  setButtonsVisibility(){
    if(this.activeStepIndex < this.steps.length - 1)
    {
      this.nextButtonVisibility="visible";
      this.completeButtonVisibility="hidden";
      this.wizardHasNextStep=true;
    }
    else
    {
      this.nextButtonVisibility="hidden";
      this.completeButtonVisibility="visible";
      this.wizardHasNextStep=false;
    }
    if(this.activeStepIndex >0)
    {
      this.prevButtonVisibility="visible";
      this.wizardHasPrevStep=true;
    }
    else
    {
      this.prevButtonVisibility="hidden";
      this.wizardHasPrevStep=false;
    }
  }

  next(event) {
    event.preventDefault();
    if (this.hasNextStep) {
      let nextStep: WizardStepComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      nextStep.isDisabled = false;
      this.activeStep = nextStep;
      this.activeStep.onLoad.emit(this.activeStep.title);
    }
    this.setButtonsVisibility();
  }

  previous(event) {
    event.preventDefault();
    //console.log("In Previous..");
    if (this.hasPrevStep) {
      let prevStep: WizardStepComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      prevStep.isDisabled = false;
      this.activeStep = prevStep;
      this.activeStep.onLoad.emit(this.activeStep.title);
    }
    this.setButtonsVisibility();
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
      this.setButtonsVisibility();
    }
    else
    {
      //console.log("Not Completed...");
    }
  }

}
