import {CUSTOM_ELEMENTS_SCHEMA, NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { routing }       from './assetConfigurationManager.routing';
import { NgaModule } from '../theme/nga.module';
import { AssetConfigurationManagerLayout } from './assetConfigurationManager.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../app.translation.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { TreeSidebar } from './sidebar/treeSidebar/treeSidebar.component';
import {  TreeMenu } from './sidebar/treeMenu/treeMenu.component';
import {TreeMenuItem } from './sidebar/treeMenu/components/treeMenuItem/treeMenuItem.component';
//import { TreeModule } from 'angular-tree-component';
import {TreeModule} from "../commonModules/treeComponent/dist/angular-tree-component"
import {TreeComponent} from "../treeComponent/tree.component";
import { TreeComponentModule } from "../commonModules/treeComponent/tree.module";
import {TreeMenuService} from "./sidebar/treeMenu/treeMenu.service";

import{AssetTreeComponent} from "./assetTree/assetTree.component";

import {TestFolderWizardComponent} from "./wizards/test-wizard/testFolder-wizard.component";
import {ArubaConfigurationAddWizardComponent} from "./wizards/aruba_APIN0205/aruba_APIN0205.component";
import {MatrecommVehiFiWizardComponent} from "./wizards/matrecomm_VehiFi/matrecomm_VehiFi-wizard.component";

//import {jqueryDragAndDropComponent} from "./dashboard/jqueryDND/jquerydnd.component";
//import {AssignAssetsWizardComponent} from "./dashboard/jqueryDND/assignAssets-wizard/assignAssets.component";
import {ModalModule} from 'ng2-bs4-modal/ng2-bs4-modal';
import {WizardModule} from "../commonModules/wizardComponent/wizard.module";
import {PageTopModule} from "../commonModules/PageTop/PageTop.module";
import {SlideMenuModule} from "../commonModules/slideMenuComponent/menu.module"

@NgModule({ 
    imports: [
      SlideMenuModule,
      BrowserAnimationsModule,
      PageTopModule,
      TreeModule,
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
    //jqueryDragAndDropComponent,
    AssetConfigurationManagerLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    AssetTreeComponent,
    TestFolderWizardComponent,
    ArubaConfigurationAddWizardComponent,
    MatrecommVehiFiWizardComponent
    //AssignAssetsWizardComponent
  ],
    exports: [   
    AssetConfigurationManagerLayout,
    TreeSidebar,
    TreeMenu,
    TreeMenuItem,
    AssetTreeComponent,
    TestFolderWizardComponent,
    ArubaConfigurationAddWizardComponent,
    MatrecommVehiFiWizardComponent
  ],
    schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
  providers: [
    TreeMenuService
  ]
})
export class AssetConfigurationManagerLayoutModule {
}
