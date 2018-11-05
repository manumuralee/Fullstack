import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";
import { Project } from "../model/project";

@Pipe({
    name: 'projectSort'
})
export class ProjectSortPipe implements PipeTransform {
    transform(items: Project[], sortyType: string, sortOrder: string): any[] {
        if (!items) return [];
        if (!sortyType || sortyType.trim() === '') return items;
        let order = sortOrder && sortOrder === 'desc' ? 'desc' : 'asc';
        if (sortyType === 'startDate') {
            return _.orderBy(items, ['startDate'], [order]);
        }

        if (sortyType === 'endDate') {
            return _.orderBy(items, ['endDate'], [order]);
        }

        if (sortyType === 'priority') {
            return _.orderBy(items, ['priority'], [order]);
        }

        if (sortyType === 'status') {
            return _.orderBy(items, ['status'], [order]);
        }

        return items;
    }
}