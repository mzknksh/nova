import { ListRange } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import { DataSourceService, IDataField, INovaFilteringOutputs, INovaFilters, ISorterFilter, LoggerService } from "@nova-ui/bits";
import { IDataSourceOutput } from "@nova-ui/dashboards";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import { BehaviorSubject } from "rxjs";

import { IRandomUserResponse, IRandomUserResults, IRandomUserTableModel, UsersQueryResponse } from "../../../types";

import { apiRoute, corsProxy, RANDOMUSER_API_URL, responseError } from "./constants";

@Injectable()
export class AcmeTableDataSource2 extends DataSourceService<IRandomUserTableModel> {
    public static providerId = "AcmeTableDataSource2";

    private readonly seed = "sw2";

    private cache = Array.from<IRandomUserTableModel>({length: 0});
    private lastSortValue?: ISorterFilter;
    private lastVirtualScroll?: ListRange;

    public page: number = 1;
    public busy = new BehaviorSubject(false);

    public dataFields: Array<IDataField> = [
        {id: "no", label: $localize`No`, dataType: "number"},
        {id: "nameFirst", label: $localize`First`, dataType: "string"},
        {id: "nameLast", label: $localize`Last`, dataType: "string"},
        {id: "country", label: $localize`Country`, dataType: "string"},
        {id: "city", label: $localize`City`, dataType: "string"},
    ];

    constructor(private logger: LoggerService) {
        super();
    }

    public async getFilteredData(filters: INovaFilters): Promise<INovaFilteringOutputs> {
        // This condition handles sorting. We want to sort columns without fetching another chunk of data.
        // Since the data is being fetched when scrolled, we compare virtual scroll indexes here in the condition as well.
        if (filters.sorter?.value) {
            if (!isEqual(this.lastSortValue, filters.sorter.value) && filters.virtualScroll?.value.start === 0 && !!this.lastVirtualScroll) {
                this.lastSortValue = filters.sorter?.value;
                this.lastVirtualScroll = filters.virtualScroll?.value;

                return {
                    repeat: {itemsSource: this.sortData(this.cache, filters)},
                    paginator: {total: 200},
                    dataFields: this.dataFields,
                };
            }
        }
        this.busy.next(true);

        const virtualScrollFilter = filters.virtualScroll && filters.virtualScroll.value;
        const start = virtualScrollFilter ? filters.virtualScroll?.value.start : 0;
        const end = virtualScrollFilter ? filters.virtualScroll?.value.end : 0;

        // Note: We should start with a clean cache every time first page is requested
        if (start === 0) {
            this.cache = [];
        }

        // We're returning Promise with setTimeout here to make the response from the server longer, as the API being used sends responses
        // almost immediately. We need it longer to be able the show the spinner component on data load
        return new Promise(resolve => {
            setTimeout(() => {
                this.getData(start, end).then((response) => {
                    if (!response?.result) {
                        this.outputsSubject.next(response);
                        return;
                    }

                    this.cache = this.cache.concat(response.result.users);

                    this.dataSubject.next(this.cache);
                    resolve({
                        repeat: {itemsSource: this.sortData(this.cache, filters)},
                        // This API can return thousands of results, however doesn't return the max number of results,
                        // so we set the max number of result manually here.
                        paginator: {total: 200},
                        dataFields: this.dataFields,
                    });

                    this.lastSortValue = filters.sorter?.value;
                    this.lastVirtualScroll = filters.virtualScroll?.value;
                    this.busy.next(false);
                    this.outputsSubject.next(response);
                });
            }, 300);
        });
    }

    public async getData(start: number = 0, end: number = 20): Promise<IDataSourceOutput<UsersQueryResponse | null>> {
        let response: IRandomUserResponse | null = null;
        try {
            response = await
            (await fetch(`${corsProxy}${RANDOMUSER_API_URL}${apiRoute}/?page=${end / (end - start) || 0}&results=${end - start}&seed=${this.seed}`)).json();
            return {
                result: {
                    users: response?.results.map((result: IRandomUserResults, i: number) => ({
                        no: this.cache.length + i + 1,
                        nameFirst: result.name.first,
                        nameLast: result.name.last,
                        country: result.location.country,
                        city: result.location.city,
                    })),
                    total: response?.results.length,
                    start: start,
                },
            } as IDataSourceOutput<UsersQueryResponse>;
        } catch (e) {
            this.busy.next(false);
            this.logger.error(responseError);
            return {
                result: null,
                error: {
                    type: responseError,
                    message: responseError,
                },
            };
        }
    }

    private sortData(data: IRandomUserTableModel[], filters: INovaFilters) {
        return orderBy(data, filters.sorter?.value?.sortBy, filters.sorter?.value?.direction as "desc" | "asc");
    }
}
