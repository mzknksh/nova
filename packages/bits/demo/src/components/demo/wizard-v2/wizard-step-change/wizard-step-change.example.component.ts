import {
    AfterViewInit,
    Component,
    TemplateRef,
    ViewChild,
} from "@angular/core";

import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { ToastService, WizardHorizontalComponent } from "@nova-ui/bits";

interface IWizardStepData {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-step-change-example",
    templateUrl: "./wizard-step-change.example.component.html",
})
export class WizardStepChangeExampleComponent implements AfterViewInit {
    public steps: IWizardStepData[] = [];

    @ViewChild("normalStep") normalStep: TemplateRef<string>;
    @ViewChild("wizard") wizard: WizardHorizontalComponent;

    constructor(private toastService: ToastService) {
    }

    public ngAfterViewInit(): void {
        this.addStep(this.normalStep, $localize`Normal step`);
    }

    public addStep(templateRef: TemplateRef<string>, title?: string): void {
        this.steps.push({ title: title ?? `Dynamic Step`, templateRef: templateRef });
    }

    public onSelectionChange($event: StepperSelectionEvent): void {
        this.toastService.info({
            title: $localize`Selected step changed.`,
            message: $localize`You moved from step with index ${$event.previouslySelectedIndex} to step with index ${$event.selectedIndex}`,
            options: {
                timeOut: 5000,
                extendedTimeOut: 2000,
            },
        });
    }

    public resetWizard(): void {
        this.wizard.reset();
    }

    public finishWizard(): void {
        this.toastService.success({
            title: $localize`Success`,
            message: $localize`Wizard was completed successfully`,
            options: {
                timeOut: 2000,
            },
        });
    }
}
