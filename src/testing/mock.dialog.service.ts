import { Injectable, Component } from "@angular/core";
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { Observable } from "../../node_modules/rxjs";
import { ModelSearch } from "../app/model/modelSearch";
import { asyncData } from './async-observable-helpers';
import { getTestProjects } from "./test.projects";
import { getParentTestTasks } from "./test.tasks";
import { getTestUsers } from "./test.users";

const PARENT_TASKS = getParentTestTasks();
const PROJECTS = getTestProjects();
const USERS = getTestUsers();


@Injectable({
    providedIn: 'root'
})
export class MockDialogService extends DialogService {
    lastResult: Observable<any>;
    constructor() {
        super(null, null, null, null);
    }

    addDialog(component, data, options): Observable<any> {
        if (data.searchType === 'user') {
            return this.lastResult = asyncData(USERS[0]);
        }
        if (data.searchType === 'project') {
            return this.lastResult = asyncData(PROJECTS[0]);
        }
        if (data.searchType === 'parent') {
            return this.lastResult = asyncData(PARENT_TASKS[0]);
        }
    }
}