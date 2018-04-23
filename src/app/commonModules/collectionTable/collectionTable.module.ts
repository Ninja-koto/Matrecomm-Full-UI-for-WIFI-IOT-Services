import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { FormsModule } from '@angular/forms';
import {DataTable} from "./DataTable";
import {DefaultSorter} from "./DefaultSorter";
import {Paginator} from "./Paginator";
import {BootstrapPaginator} from "./BootstrapPaginator";
import {CollectionTableComponent} from "./collectionTable.component";
import {CollectionTablePipe} from "./collectionTable.pipe";
import {CollectionTableColumnEleComponent} from "./collectionTableColumnEle.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        DataTable,
        DefaultSorter,
        Paginator,
        BootstrapPaginator,
        CollectionTableComponent,
        CollectionTablePipe,
        CollectionTableColumnEleComponent
    ],
    exports: [
        DataTable,
        DefaultSorter,
        Paginator,
        BootstrapPaginator,
        CollectionTableComponent,
        CollectionTablePipe,
        CollectionTableColumnEleComponent
    ]
})
export class CollectionTableModule {

}