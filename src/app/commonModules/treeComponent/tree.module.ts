import {CUSTOM_ELEMENTS_SCHEMA, NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { TreeModule } from 'angular-tree-component';
import {TreeModule} from "./dist/angular-tree-component"
import {TreeComponent} from "./tree.component";

@NgModule({ 
    imports: [
     TreeModule,
    CommonModule,
     FormsModule,
    AppTranslationModule,
  ],
  declarations: [
   TreeComponent
  ],
  exports:[
   TreeComponent    
  ],
  providers: [
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
]
})
export class TreeComponentModule {
}
