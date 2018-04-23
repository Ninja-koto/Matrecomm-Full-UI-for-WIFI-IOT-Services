import { CUSTOM_ELEMENTS_SCHEMA,NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing }       from './commonDashboardLayout.routing';
import { NgaModule } from '../theme/nga.module';
import { CommonDashboardLayout } from './commonDashboardLayout.component';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

/*import { NgxLineChartComponent } from './dashboard/ngxLineChart/ngxLineChart.component';
import { VerticalBarChartComponent } from './dashboard/verticalBarChart/verticalBarChart.component';
import { BarchartService} from './dashboard/verticalBarChart/verticalBarChart.service';
import { AdvancedPieChartComponent } from './dashboard/advancedPieChart/advancedPieChart.component';
import { AdvancedPiechartService } from './dashboard/advancedPieChart/advancedPieChart.service';*/
import {DashboardTable} from "./dashboard/dashboardTable/dashboardTable.component";
import {AlertTabComponent} from "./dashboard/alertsTab/alertTab.component";
import {RadiusAcctSessionsTable} from "./dashboard/dashboardTable/radiusAcctSessTable.component";
//import {TreeComponent} from "../treeComponent/tree.component";


import {PieChart} from "./dashboard/pieChart";
import { TreeSidebar } from './sidebar/treeSidebar/treeSidebar.component';
import {  TreeMenu } from './sidebar/treeMenu/treeMenu.component';
import {TreeMenuItem } from './sidebar/treeMenu/components/treeMenuItem/treeMenuItem.component';
import { TreeModule } from 'angular-tree-component';
import {TreeMenuService} from "./sidebar/treeMenu/treeMenu.service";
import { TreeComponentModule } from "../commonModules/treeComponent/tree.module";
import {TabsPanelModule} from "../commonModules/tabsPanelComponent/tabsPanel.module";
import {CollectionTableModule} from "../commonModules/collectionTable/collectionTable.module";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
import {ChartsModule1} from "../commonModules/chartsComponent1/charts.module1";
@NgModule({ 
    imports: [
      ChartsModule1,
      PageTopModule,
      TreeModule,
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    NgxChartsModule,
    TreeComponentModule,
    TabsPanelModule,
    CollectionTableModule
  ],
  declarations: [
    //TreeComponent,
    /*NgxLineChartComponent,
    VerticalBarChartComponent,
    AdvancedPieChartComponent,*/
    CommonDashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    PieChart,
    DashboardTable,
    AlertTabComponent,
    RadiusAcctSessionsTable
  ],
 exports:[
   /*NgxLineChartComponent,   
   VerticalBarChartComponent,
    AdvancedPieChartComponent,*/
    CommonDashboardLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem ,
    DashboardTable,
    RadiusAcctSessionsTable
  ],
    schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    //BarchartService,
    //AdvancedPiechartService,
    TreeMenuService
  ]
})
export class CommonDashboardLayoutModule {
}
