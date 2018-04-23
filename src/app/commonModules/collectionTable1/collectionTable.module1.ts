import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';
import {CollectionTableComponent1} from "./collectionTable.component1";
import {CollectionTableModule} from "../collectionTable/collectionTable.module";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CollectionTableModule
    ],
    declarations: [
        CollectionTableComponent1
    ],
    exports: [
        CollectionTableComponent1
    ]
})
export class CollectionTableModule1 {

}