import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import {routing} from "./assetInventory.routing";

import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {HttpModule} from "@angular/http";
import {Ng2Webstorage} from 'ngx-webstorage';

//import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
//import {MultiselectDropdown} from "angular-2-dropdown-multiselect";
import {MultiselectDropdownModule} from "../../commonModules/multiSelect/dropdown.module";
//import {MultiselectDropdown} from "../../commonModules/multiSelect/dropdown.component";

import {AssetInventory} from "./assetInventory.component";
import {AssetInventoryTable} from "./assetInventoryTable/assetInventoryTable";
import {AssetInventoryAddWizardComponent} from "./assetInventoryTable/add-wizard/assetInventory-wizard.component";
import { DateTimePickerModule } from 'ng-pick-datetime';
//import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
//import {MomentModule} from 'angular2-moment';



@NgModule({
  imports: [
       Ng2Webstorage,
       DateTimePickerModule,
       //MomentModule,
      //NguiDatetimePickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppTranslationModule,
    MultiselectDropdownModule,
    NgaModule,
    routing,
    CollectionTableModule,
    ModalModule,
    WizardModule,
  ],
  declarations: [
    AssetInventory,
    AssetInventoryTable,
    AssetInventoryAddWizardComponent
    ]
})
export class AssetInventoryModule {
}