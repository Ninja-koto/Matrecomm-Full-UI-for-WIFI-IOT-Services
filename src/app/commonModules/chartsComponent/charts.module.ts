import {CUSTOM_ELEMENTS_SCHEMA,NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {AdvancedPieChartComponent} from "./advancedPieChart.component";
import {NgxLineChartComponent} from "./ngxLineChart.component";
import {VerticalBarChartComponent} from "./verticalBarChart.component";

import {DashboardCollectionTable} from "./dashboardTable.component";
import {DashboardTableDataCollectorService} from "./dashboardTable.service";

import {CollectionTableModule} from "../collectionTable/collectionTable.module";
import { NgxChartsModule } from '@swimlane/ngx-charts';
@NgModule({
    imports: [
        CollectionTableModule,
        NgxChartsModule,
        CommonModule
    ],
    declarations: [
        DashboardCollectionTable,
        AdvancedPieChartComponent,
        NgxLineChartComponent,
        VerticalBarChartComponent
    ],
    exports: [
        DashboardCollectionTable,
        AdvancedPieChartComponent,
        NgxLineChartComponent,
        VerticalBarChartComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
providers:[DashboardTableDataCollectorService]
})
export class ChartsModule {

}