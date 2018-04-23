import {CUSTOM_ELEMENTS_SCHEMA,NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";


import {NgxLineChartComponent1} from "./ngxLineChart.component1";
import {DashboardAssetTable} from "./dashboardAssetTable.component"
import {DashboardUsersTable} from "./dashboardUsersTable.component"
import {DashboardBasicAssetTable} from "./dashboardBasicAssetTable.component"
import {VerticalBarChartComponent1} from "./verticalBarChart.component1"
import {AdvancedPieChartComponent1} from "./advancedPieChart.component1"
import {HorizontalBarChartComponent1} from "./horizontalBar.component"
import {VerticalBarStackChartComponent1} from "./verticalBarStackedChart.component1"

import {CollectionTableModule} from "../collectionTable/collectionTable.module";
import { NgxChartsModule } from '@swimlane/ngx-charts';
@NgModule({
    imports: [
        CollectionTableModule,
        NgxChartsModule,
        CommonModule
    ],
    declarations: [
        NgxLineChartComponent1,
        DashboardAssetTable,
        DashboardUsersTable,
        VerticalBarChartComponent1,
        AdvancedPieChartComponent1,
        DashboardBasicAssetTable,
        HorizontalBarChartComponent1,
        VerticalBarStackChartComponent1
    ],
    exports: [
        NgxLineChartComponent1,
        DashboardAssetTable,
        DashboardUsersTable,
        VerticalBarChartComponent1,
        AdvancedPieChartComponent1,
        DashboardBasicAssetTable,
        HorizontalBarChartComponent1,
        VerticalBarStackChartComponent1
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
providers:[]
})
export class ChartsModule1 {

}