import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDatePickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiProgressModule,
    NuiRadioModule,
    NuiSpinnerModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    NuiWizardV2Module,
    SrlcStage,
    NuiSelectV2Module,
    NuiOverlayModule,
    NuiTooltipModule,
} from "@nova-ui/bits";

import {
    WizardBusyExampleComponent,
    WizardCustomComponent,
    WizardCustomExampleComponent,
    WizardCustomFooterExampleComponent,
    WizardDialogExampleComponent,
    WizardDocsComponent,
    WizardDynamicExampleComponent,
    WizardHorizontalExampleComponent,
    WizardRemoveStepExampleComponent,
    WizardVerticalExampleComponent,
    WizardAsyncFormValidationExampleComponent,
    WizardWithCustomIconsExampleComponent,
    WizardRestoreStateExampleComponent,
    WizardStepChangeExampleComponent,
    WizardResponsiveHeaderExampleComponent,
    WizardWithConfirmationDialogOnCancelExampleComponent,
    WizardTooltipExampleComponent,
    WizardV2TestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: WizardDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "confirm-on-cancel",
        component: WizardWithConfirmationDialogOnCancelExampleComponent,
        data: {
            showThemeSwitcher: true,
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: WizardV2TestComponent,
        data: {
            "srlc": {
                hideIndicator: true,
            },
            showThemeSwitcher: false,
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiMessageModule,
        NuiDocsModule,
        NuiTextboxModule,
        NuiRadioModule,
        NuiCheckboxModule,
        NuiDialogModule,
        NuiValidationMessageModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NuiWizardV2Module,
        NuiSpinnerModule,
        NuiBusyModule,
        NuiProgressModule,
        NuiDatePickerModule,
        NuiIconModule,
        NuiSelectV2Module,
        NuiOverlayModule,
        NuiTooltipModule,
    ],
    declarations: [
        WizardDocsComponent,
        WizardHorizontalExampleComponent,
        WizardVerticalExampleComponent,
        WizardCustomExampleComponent,
        WizardCustomComponent,
        WizardDialogExampleComponent,
        WizardBusyExampleComponent,
        WizardCustomFooterExampleComponent,
        WizardDynamicExampleComponent,
        WizardRemoveStepExampleComponent,
        WizardAsyncFormValidationExampleComponent,
        WizardWithCustomIconsExampleComponent,
        WizardRestoreStateExampleComponent,
        WizardStepChangeExampleComponent,
        WizardResponsiveHeaderExampleComponent,
        WizardWithConfirmationDialogOnCancelExampleComponent,
        WizardTooltipExampleComponent,
        WizardV2TestComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class WizardV2Module { }
