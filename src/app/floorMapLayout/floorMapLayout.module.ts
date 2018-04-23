import {CUSTOM_ELEMENTS_SCHEMA, NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { routing }       from './floorMapLayout.routing';
import { NgaModule } from '../theme/nga.module';
import { FloorMapLayout } from './floorMapLayout.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TreeSidebar } from './sidebar/treeSidebar/treeSidebar.component';
import {  TreeMenu } from './sidebar/treeMenu/treeMenu.component';
import {TreeMenuItem } from './sidebar/treeMenu/components/treeMenuItem/treeMenuItem.component';
import { TreeModule } from 'angular-tree-component';
import {TreeComponent} from "../treeComponent/tree.component";
import { TreeComponentModule } from "../commonModules/treeComponent/tree.module";
import {TreeMenuService} from "./sidebar/treeMenu/treeMenu.service";

import {jqueryDragAndDropComponent} from "./components/jqueryDND/jquerydnd.component";
import {AssignAssetsWizardComponent} from "./components/jqueryDND/assignAssets-wizard/assignAssets.component";
import {FloorAssignedAssetsTable} from "./components/floorAssignedAssetsTable/floorAssignedAssetsTable.component";
import {FloorUnAssignedAssetsTable} from "./components/floorUnAssignedAssetsTable/floorUnAssignedAssetsTable.component";
import {LoadBalanceConfigurationTable} from "./components/loadBalanceConfiguration/loadBalanceConfiguration.component";
import {LoadBalanceConfigWizardComponent} from "./components/loadBalanceConfiguration/add-wizard/loadBalanceConfig-wizard.component";

import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {WizardModule} from "../commonModules/wizardComponent/wizard.module";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
import {CollectionTableModule} from "../commonModules/collectionTable/collectionTable.module";
import {TabsPanelModule} from "../commonModules/tabsPanelComponent/tabsPanel.module";

@NgModule({ 
    imports: [
      TabsPanelModule,
      CollectionTableModule,
      PageTopModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppTranslationModule,
    NgaModule,
    routing,
    TreeComponentModule,
    ModalModule,
    WizardModule
    
  ],
  declarations: [
    jqueryDragAndDropComponent,
    FloorMapLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    AssignAssetsWizardComponent,
    FloorAssignedAssetsTable,
    FloorUnAssignedAssetsTable,
    LoadBalanceConfigurationTable,
    LoadBalanceConfigWizardComponent
  ],
    exports: [   
    jqueryDragAndDropComponent,
    FloorMapLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    AssignAssetsWizardComponent,
    FloorAssignedAssetsTable,
    FloorUnAssignedAssetsTable,
    LoadBalanceConfigurationTable,
    LoadBalanceConfigWizardComponent
  ],
    schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    TreeMenuService
  ]
})
export class FloorMapLayoutModule {
}
