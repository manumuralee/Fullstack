import { Pipe, PipeTransform } from "@angular/core";
import { Task } from "../model/task";

@Pipe({
    name: 'taskSearch'
})
export class TaskSearchPipe implements PipeTransform {
    transform(items: Task[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText || searchText.trim() === '') return items;
        searchText = searchText.trim().toLowerCase();
        return items.filter(task => {
            return (task && task.project && task.project.projectName.toLowerCase().includes(searchText));
        });
    }
}