import { Pipe, PipeTransform } from "@angular/core";
import { Project } from "../model/project";

@Pipe({
    name: 'projectSearch'
})
export class ProjectSearchPipe implements PipeTransform {
    transform(items: Project[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText || searchText.trim() === '') return items;
        searchText = searchText.trim().toLowerCase();
        return items.filter(project => {
            return (project.projectName.toLowerCase().includes(searchText));
        });
    }
}