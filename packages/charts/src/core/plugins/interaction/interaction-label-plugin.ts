import find from "lodash/find";
import isArray from "lodash/isArray";
import isEmpty from "lodash/isEmpty";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { CHART_VIEW_STATUS_EVENT, INTERACTION_VALUES_EVENT } from "../../../constants";
import { ChartPlugin } from "../../common/chart-plugin";
import { convert } from "../../common/scales/helpers/convert";
import { IScale } from "../../common/scales/types";
import { D3Selection, IChartEvent, IChartViewStatusEventPayload, InteractionType } from "../../common/types";
import { UtilityService } from "../../common/utility.service";
import { XYGrid } from "../../grid/xy-grid";
import { IInteractionValuesPayload } from "../types";

/** @ignore */
const FALLBACK_FORMATTER = "tick";

/**
 * Highlights the label on x-axis that corresponds to interaction position
 *
 * @class InteractionLabelPlugin
 * @extends {ChartPlugin}
 */
export class InteractionLabelPlugin extends ChartPlugin {
    public static LAYER_NAME = "interaction-label";

    public areLabelUpdatesEnabled = true;

    private isChartInView = false;
    private lastInteractionValuesPayload: IInteractionValuesPayload;
    private interactionLabelLayer: D3Selection<SVGElement>;
    private destroy$ = new Subject();

    constructor(private formatterName = "title") {
        super();
    }

    public initialize(): void {
        this.interactionLabelLayer = this.chart.getGrid().getLasagna().addLayer({
            name: InteractionLabelPlugin.LAYER_NAME,
            order: 901,
            clipped: false,
        });

        this.chart.getEventBus().getStream(INTERACTION_VALUES_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent) => {
                this.lastInteractionValuesPayload = event.data;
                if (this.isChartInView) {
                    this.handleLabelUpdate();
                }
            });

        this.chart.getEventBus().getStream(CHART_VIEW_STATUS_EVENT)
            .pipe(takeUntil(this.destroy$))
            .subscribe((event: IChartEvent<IChartViewStatusEventPayload>) => {
                this.isChartInView = event.data.isChartInView;
                if (this.isChartInView && this.lastInteractionValuesPayload) {
                    this.handleLabelUpdate();
                }
            });
    }

    protected handleLabelUpdate() {
        const scales = this.chart.getGrid().scales;
        if (!this.areLabelUpdatesEnabled || this.lastInteractionValuesPayload.interactionType !== InteractionType.MouseMove || isEmpty(scales)) {
            return;
        }

        const grid: XYGrid = <any>this.chart.getGrid();
        const xScale = find(scales["x"].index, { id: grid.bottomScaleId });

        if (!xScale) {
            throw new Error("xScale is not defined");
        }

        const xValue = this.lastInteractionValuesPayload.values.x ? this.lastInteractionValuesPayload.values.x[xScale.id] : null;
        this.updateLabel(xScale, isArray(xValue) ? xValue.slice(0, xValue.length - 1) : xValue);
    }

    protected updateLabel(scale: IScale<any>, value: any) {
        let interactionLabel: D3Selection<SVGGElement> = this.interactionLabelLayer.select(`.${InteractionLabelPlugin.LAYER_NAME}`);
        if (interactionLabel.empty() && !!value) {
            interactionLabel = this.buildInteractionLabel(this.interactionLabelLayer);
        } else if (!value) {
            interactionLabel.remove();
            return;
        }

        const formatter = scale.formatters[this.formatterName] || scale.formatters[FALLBACK_FORMATTER];
        const labelContent = formatter?.(value);

        if (!labelContent) {
            throw new Error("labelContent is not defined");
        }

        const textSelection = interactionLabel.select("text")
            .text(labelContent);
        const bbox = (textSelection.node() as any).getBBox();
        const gridDimension = this.chart.getGrid().config().dimension;

        // subtract the relative vertical text offset inside the bbox from
        // the grid height to determine the label's vertical placement
        const heightOffset = (gridDimension.height() - bbox.y);

        textSelection
            .attr("transform", `translate(0, ${heightOffset})`)
            .style("text-anchor", "middle");

        // match the horizontal padding to the built-in bbox vertical padding
        const horizontalPadding = (bbox.height + bbox.y) * 2;

        const labelWidth = bbox.width + horizontalPadding;
        const allowedRange: [number, number] = [(labelWidth / 2), gridDimension.width() - (labelWidth / 2)];
        const x = convert(scale, value, 0.5);
        const clampedX = UtilityService.clampToRange(x, allowedRange);

        interactionLabel
            .attr("transform", `translate(${clampedX},0)`)
            .select("rect")
            .attrs({
                "transform": `translate(0,${heightOffset})`,
                "x": -(labelWidth / 2),
                "y": bbox.y,
                "width": labelWidth,
                "height": bbox.height,
            });
    }

    public destroy(): void {
        this.chart.getGrid().getLasagna().removeLayer(InteractionLabelPlugin.LAYER_NAME);
        this.destroy$.next();
        this.destroy$.complete();
    }

    private buildInteractionLabel(target: D3Selection): D3Selection<SVGGElement> {
        const label = target.append("g")
            .attr("class", InteractionLabelPlugin.LAYER_NAME);

        label.append("rect")
            .attr("class", `${InteractionLabelPlugin.LAYER_NAME}__rect`);

        label.append("text")
            .attr("class", `${InteractionLabelPlugin.LAYER_NAME}__text`);

        return label;
    }

}
