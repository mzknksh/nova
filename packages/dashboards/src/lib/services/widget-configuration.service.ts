import { Injectable } from "@angular/core";

import { IWidget } from "../components/widget/types";

@Injectable()
export class WidgetConfigurationService {
    private widget: IWidget;

    public updateWidget(widget: IWidget) {
        this.widget = widget;
    }

    public getWidget() {
        return this.widget;
    }
}
