import {NgModule} from "@angular/core"
import {CommonModule} from "@angular/common"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {routing} from "./mediaManagement.routing"

import { NgaModule } from '../../theme/nga.module';
import {CollectionTableModule} from "../../commonModules/collectionTable/collectionTable.module";
import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {Ng2Webstorage} from 'ngx-webstorage';

import {MediaManagement} from "./mediaManagement.component"
import {MediaStoreTable} from "./mediaStoreTable/mediaStoreTable.component"
import {MediaStoreAddWizardComponent} from "./mediaStoreTable/add-wizard/mediaStore-wizard.component"

import {MediaProfileTable} from "./mediaProfileTable/mediaProfileTable.component"
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';

@NgModule({
    imports:[
        NgaModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        ModalModule,
        CollectionTableModule,
        WizardModule,
        Ng2Webstorage
    ],
    declarations:[
        MediaManagement,
        MediaStoreTable,
        MediaStoreAddWizardComponent,
        MediaProfileTable
    ],
    exports:[
        MediaManagement,
        MediaStoreTable,
        MediaStoreAddWizardComponent,
        MediaProfileTable
    ]
})
export class MediaManagementModule{

}
