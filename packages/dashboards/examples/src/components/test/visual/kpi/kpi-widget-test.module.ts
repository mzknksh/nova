import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NuiBusyModule, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiSwitchModule } from "@nova-ui/bits";
import { DEFAULT_PIZZAGNA_ROOT, NuiDashboardsModule, ProviderRegistryService, WellKnownPathKey, WidgetTypesService } from "@nova-ui/dashboards";

import { TestCommonModule } from "../../common/common.module";
import { TestKpiDataSource, TestKpiDataSource2, TestKpiDataSourceBigNumber, TestKpiDataSourceSmallNumber } from "../../data/kpi-data-sources";

import { KpiDashboardComponent } from "./kpi-widget-test.component";
import { KpiErrorTestComponent } from "./kpi-error/kpi-error-test.component";

const routes = [
    {
        path: "",
        component: KpiDashboardComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "error",
        component: KpiErrorTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        TestCommonModule,
        NuiDashboardsModule,
        NuiBusyModule,
        NuiButtonModule,
        NuiDocsModule,
        NuiSwitchModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        KpiDashboardComponent,
        KpiErrorTestComponent,
    ],
    providers: [
        ProviderRegistryService,
    ],
})
export class KpiWidgetTestModule {
    constructor(widgetTypesService: WidgetTypesService) {
        const widgetTemplate = widgetTypesService.getWidgetType("kpi", 1);
        delete widgetTemplate.widget.structure[DEFAULT_PIZZAGNA_ROOT].providers?.refresher;

        widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders,
                                   [
                                       TestKpiDataSource.providerId,
                                       TestKpiDataSource2.providerId,
                                       TestKpiDataSourceBigNumber.providerId,
                                       TestKpiDataSourceSmallNumber.providerId,
                                   ]);
    }
}
