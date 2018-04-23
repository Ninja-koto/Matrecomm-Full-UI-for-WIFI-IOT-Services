import {Component, Input, OnInit} from "@angular/core";
import {DataTable, SortEvent} from "./DataTable";

@Component({
    selector: "mfDefaultSorter",
    template: `
        <a style="cursor: pointer" (click)="sort()" class="text-nowrap">
            <ng-content></ng-content>
            <!--<span *ngIf="isSortedByMeAsc" class="glyphicon glyphicon-triangle-top" aria-hidden="true"></span>-->
            <div>
            &nbsp;<!--<span *ngIf="isSortedByMeAsc" class="fa fa-arrow-circle-up" aria-hidden="true"></span>
            <span *ngIf="isSortedByMeDesc" class="fa fa-arrow-circle-down" aria-hidden="true"></span>-->
             <span *ngIf="isSortedByMeAsc" class="ion-arrow-up-b" aria-hidden="true"></span>
            <span *ngIf="isSortedByMeDesc" class="ion-arrow-down-b" aria-hidden="true"></span>
            </div>
        </a>`
})
export class DefaultSorter implements OnInit {
    @Input("by") sortBy: string;

    isSortedByMeAsc: boolean = false;
    isSortedByMeDesc: boolean = false;

    public constructor(private mfTable: DataTable) {
    }

    public ngOnInit(): void {
        this.mfTable.onSortChange.subscribe((event: SortEvent) => {
            this.isSortedByMeAsc = (event.sortBy == this.sortBy && event.sortOrder == "asc");
            this.isSortedByMeDesc = (event.sortBy == this.sortBy && event.sortOrder == "desc");
        });
    }

    sort() {
        if (this.isSortedByMeAsc) {
            this.mfTable.setSort(this.sortBy, "desc");
        } else {
            this.mfTable.setSort(this.sortBy, "asc");
        }
    }
}
