import { IDataField, IDataFieldsConfig } from "@nova-ui/bits";
import { IAllAround, IAccessors, IChartAssistSeries } from "@nova-ui/charts";
import { BehaviorSubject } from "rxjs";

import { IProportionalDonutContentAggregator } from "../../functions/proportional-aggregators/types";
import { IFormatter, IFormatterDefinition } from "../types";
import { ILegendPlacementOption, LegendPlacement } from "../../widget-types/common/widget/legend"

export enum ProportionalWidgetChartTypes {
    DonutChart = "DonutChart",
    PieChart = "PieChart",
    VerticalBarChart = "VerticalBarChart",
    HorizontalBarChart = "HorizontalBarChart",
}

export interface IProportionalWidgetChartTypeConfiguration {
    id: ProportionalWidgetChartTypes;
    label: string;
}

export interface ITickLabelConfig {
    maxWidth: Partial<IAllAround<number>>;
}

export interface IProportionalWidgetChartOptions {
    type: ProportionalWidgetChartTypes;
    contentFormatter?: IFormatter;
    legendPlacement?: LegendPlacement;
    legendFormatter?: IFormatter;
    chartFormatterComponentType?: string;
    donutContentConfig?: IDonutContentConfig;
    horizontalBarTickLabelConfig?: ITickLabelConfig;
}

export interface IProportionalWidgetConfig {
    chartDonutContentLabel?: string;
    chartDonutContentIcon?: string;
    chartOptions: IProportionalWidgetChartOptions;
    /** Chart and legend will emit an INTERACTION event on click if this property is enabled */
    interactive?: boolean;
    chartColors?: string[] | { [key: string]: string };
    /** set "true" if you want for widget configuration to override colors that come built-in data */
    prioritizeWidgetColors?: boolean;
}

export interface ILegendFormat {
    displayValue: string;
    formatKey: string;
}

export interface IProportionalWidgetChartEditorOptions {
    chartTypes: ProportionalWidgetChartTypes[];
    legendPlacementOptions: ILegendPlacementOption[];
    legendFormats: Array<ILegendFormat>;
    legendFormatters: IFormatterDefinition[];
    contentFormatters?: IFormatterDefinition[];
}

export interface IDonutContentConfig {
    formatter: IFormatter;
    aggregator: IProportionalDonutContentAggregator;
}

export interface IProportionalDataFieldsConfig extends IDataFieldsConfig {
    chartSeriesDataFields$: BehaviorSubject<IDataField[]>;
}

export interface IProportionalWidgetData extends IChartAssistSeries<IAccessors> {
    link?: string;
}
