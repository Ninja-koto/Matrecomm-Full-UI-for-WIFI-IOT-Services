import {NgModule} from "@angular/core"
import {CommonModule} from "@angular/common"
import {routing} from "./advMgmt.routing"
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import {WizardModule} from "../../commonModules/wizardComponent/wizard.module";
import {Ng2Webstorage} from 'ngx-webstorage';

import {AdvertisementManagement} from "./advMgmt.component"
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
    imports:[
        FileUploadModule,
        Ng2Webstorage,
        WizardModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        routing
    ],
    declarations:[
        AdvertisementManagement
    ]
})

export class AdvertisementManagementModule{
    
}