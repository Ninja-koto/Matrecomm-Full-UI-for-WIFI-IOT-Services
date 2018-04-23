import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import {routing} from "./historicalLogs.routing";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

import {HttpModule} from "@angular/http";
import {CoolStorageModule} from "angular2-cool-storage";
import {Ng2Webstorage} from 'ngx-webstorage';
import { DateTimePickerModule } from 'ng-pick-datetime';
//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";

import {HistoricalLogs} from "./historicalLogs.component";
import {HistLogsGenerator} from "./histLogsGenerator/histLogsGenerator.component";
//import {CustomValidationMessagesComponent} from "../../commonServices/customValidationMessages.component";
//import { Ng2FileInputModule } from 'ng2-file-input';
@NgModule({
  imports: [
    MultiselectDropdownModule,
    DateTimePickerModule,
    Ng2Webstorage,
    CoolStorageModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    CollectionTableModule,
    ModalModule,
    WizardModule,

    // Ng2FileInputModule.forRoot()
  ],
  declarations: [
    HistoricalLogs,
    HistLogsGenerator
    ],
  exports: [
    HistoricalLogs,
    HistLogsGenerator
  ]
})
export class HistoricalLogsModule {
}
