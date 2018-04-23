import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';
import { RouterModule }  from '@angular/router';
import {PageTop} from "./PageTop.component";
import {MsgCenter} from "../MsgCenter/MsgCenter.component";
import {MsgCenterService} from "../MsgCenter/MsgCenter.service";
import {ProfilePicturePipe} from"./ProfilePicture.pipe";
import {ContentTop} from "../ContentTop/ContentTop.component";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
@NgModule({
    imports: [
        ModalModule,
        RouterModule,
        CommonModule,
        FormsModule
    ],
    declarations: [
        MsgCenter,
        PageTop,
        ProfilePicturePipe,
        ContentTop
    ],
    exports: [
        MsgCenter,
        PageTop,
        ProfilePicturePipe,
        ContentTop
    ]
})
export class PageTopModule {

}