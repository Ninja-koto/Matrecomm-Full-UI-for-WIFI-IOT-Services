import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {WizardStepComponent} from "./wizard-step.component";
import {WizardComponent} from "./wizard.component";
import {DeleteWizardComponent} from "./deleteWizard.component";
import {CustomValidationMessagesComponent} from "./customValidationMessages.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        WizardComponent,
        WizardStepComponent,
        DeleteWizardComponent,
        CustomValidationMessagesComponent
    ],
    exports: [
        WizardComponent,
        WizardStepComponent,
        DeleteWizardComponent,
        CustomValidationMessagesComponent
    ]
})
export class WizardModule {

}