import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import {
    INovaFilteringOutputs, LocalFilteringDataSource, PaginatorComponent, SearchComponent, SorterComponent,
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

const INITIAL_ARRAY = [
    {color: "regular-blue"},
    {color: "regular-green"},
    {color: "regular-yellow"},
    {color: "regular-cyan"},
    {color: "regular-magenta"},
    {color: "regular-black"},
    {color: "dark-blue"},
    {color: "dark-green"},
    {color: "dark-yellow"},
    {color: "dark-cyan"},
    {color: "dark-magenta"},
    {color: "light-blue"},
    {color: "light-green"},
    {color: "light-yellow"},
    {color: "light-cyan"},
    {color: "light-magenta"},
];

/**
 * TODO: Remove in v12 - NUI-5835
 * @deprecated
 */
@Component({
    selector: "nui-deprecated-client-side-delayed-data-source-example",
    providers: [LocalFilteringDataSource],
    templateUrl: "./client-side-delayed.example.component.html",
})
export class DepreacatedDataSourceClientSideDelayedExampleComponent implements AfterViewInit, OnDestroy {
    public searchTerm = "";
    public page = 1;
    public sorter = {
        columns: ["color", "red", "green", "blue"],
        sortedColumn: "color",
        direction: "asc",
    };

    public state: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            // @ts-ignore: used for demo purposes
            total: undefined,
        },
    };

    public filters: any[];
    public selectedFilters: any[];

    private delayActionSubject: Subject<any> = new Subject();
    private outputsSubscription: Subscription;

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringSorter") filteringSorter: SorterComponent;

    constructor(public dataSourceService: LocalFilteringDataSource<any>,
                public changeDetection: ChangeDetectorRef) {
        dataSourceService.setData(INITIAL_ARRAY);

        this.filters = ["regular", "dark", "light"];
        this.selectedFilters = [];
    }

    ngAfterViewInit() {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch,
            },
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        };
        this.dataSourceService.applyFilters();
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.state = data;
            if (data.paginator?.reset) {
                this.filteringPaginator.page = 1;
            }
            this.changeDetection.detectChanges();
        });
        this.delayActionSubject.pipe(debounceTime(500)).subscribe(() => {
            this.dataSourceService.applyFilters();
        });
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public onSearch() {
        this.delayActionSubject.next();
    }

    public changePagination() {
        this.dataSourceService.applyFilters();
    }

}
