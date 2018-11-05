import { Pipe, PipeTransform } from "@angular/core";
import * as _ from "lodash";
import { User } from "../model/user";

@Pipe({
    name: 'userSort'
})
export class UserSortPipe implements PipeTransform {
    transform(items: User[], sortyType: string, sortOrder: string): any[] {
        if (!items) return [];
        if (!sortyType || sortyType.trim() === '') return items;
        let order = sortOrder && sortOrder === 'desc' ? 'desc' : 'asc';
        if (sortyType === 'firstName') {
            return _.orderBy(items, ['firstName'], [order]);
        }

        if (sortyType === 'lastName') {
            return _.orderBy(items, ['lastName'], [order]);
        }

        if (sortyType === 'employeeId') {
            return _.orderBy(items, ['employeeId'], [order]);
        }

        return items;
    }
}