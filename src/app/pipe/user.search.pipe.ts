import { PipeTransform, Pipe } from "@angular/core";
import { User } from "../model/user";

@Pipe({
    name: 'userSearch'
})
export class UserSearchPipe implements PipeTransform {
    transform(items: User[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText || searchText.trim() === '') return items;
        searchText = searchText.trim().toLowerCase();
        return items.filter(user => {
            return (user.firstName.toLowerCase().includes(searchText)
                || user.lastName.toLowerCase().includes(searchText));
        });
    }
}