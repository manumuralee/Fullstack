import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { ModelSearch } from '../model/modelSearch';
import { ParentTask } from '../model/parent-task';
import { Project } from '../model/project';
import { User } from '../model/user';
@Component({
    selector: 'prompt',
    templateUrl: 'search.dialog.component.html'
})
export class SearchDialogComponent extends DialogComponent<ModelSearch, any> implements ModelSearch {
    title: string;
    searchType: string;
    users: User[];
    projects: Project[];
    parents: ParentTask[];
    selectedUser: User;
    selectedProject: Project;
    selectedParent: ParentTask;

    userName: string = '';
    projectName: string = '';
  
    constructor(public dialogService: DialogService) {
        super(dialogService);
    }

    confirmUser(user: User) {
        this.result = user;
        this.close();
    }

    confirmProject(project: Project) {
        this.result = project;
        this.close();
    }

    confirmParent(parent: ParentTask) {
        this.result = parent;
        this.close();
    }

    cancel() {
        this.close();
    }
}