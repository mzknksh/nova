import {
  ElementRef,
  EventEmitter,
  QueryList,
} from "@angular/core";
import { IEvent } from "@nova-ui/bits";
import { BehaviorSubject } from "rxjs";
import { DashwizStepComponent } from "../dashwiz-step/dashwiz-step.component";
import { IDashwizButtonsComponent, IDashwizStepComponent, IDashwizStepNavigatedEvent, IDashwizWaitEvent } from "../types";

export interface IDashwizComponent {
  steps: QueryList<DashwizStepComponent>;
  stepTitles: QueryList<ElementRef>;
  dynamicStep: any;
  /**
   * Set to true to hide the wizard header including the step breadcrumbs.
   * (default: false)
   */
  hideHeader: boolean;
  /**
   * Set to true to show the "Next" button at any point during the wizard process.
   * (default: false)
   */
  canProceed: boolean;
  /**
   * Set to true to show the "Finish" button at any point during the wizard process.
   * (default: false)
   */
  canFinish: boolean;
  /**
   * Overrides the default text on the finish step button.
   * (default: 'Action')
   */
  finishText: string;
  /**
   * Use this to stretch lines between step labels according to largest label width.
   * (default: false)
   */
  stretchStepLines: boolean;
  /**
   * Optional components to use for the buttons for each step
   */
  buttonComponentTypes: string[];
  /**
   * Evaluated when a step is selected.
   */
  stepNavigated: EventEmitter<IDashwizStepNavigatedEvent>;
  /**
   * Evaluated when the user attempts to cancel the wizard.
   */
  cancel: EventEmitter<boolean>;
  /**
   * Evaluated when the user completes the wizard.
   */
  finish: EventEmitter<any>;
  /**
   * Emits when next button is clicked.
   */
  next: EventEmitter<any>;
  /**
   * Emits when Back button is clicked.
   */
  back: EventEmitter<any>;
  /**
   * Use this BehaviorSubject to control navigability between steps
   */
  navigationControl: BehaviorSubject<IDashwizWaitEvent>;
  currentStep: DashwizStepComponent;
  stepLineWidth: number;
  stepIndex: number;
  buttonProperties: IDashwizButtonsComponent;
  buttonPortalActionMap: Record<string, Function>;
  addStepDynamic(wizardStep: IDashwizStepComponent, indexToInsert: number): any;
  disableStep(step: DashwizStepComponent): void;
  enableStep(step: DashwizStepComponent): void;
  hideStep(step: DashwizStepComponent): void;
  showStep(step: DashwizStepComponent): void;
  goToStep(stepIndex: number): void;
  selectStep(step: DashwizStepComponent): void;
  onBack(): void;
  onNext(): void;
  onFinish(): void;
  onCancel(): void;
  enterAnotherStep(): void;
  onButtonPortalOutput(event: IEvent): void;
}
