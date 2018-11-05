import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../app/model/project';
import { ProjectService } from '../app/services/project.service';
import { asyncData } from './async-observable-helpers';
import { getTestProjects } from './test.projects';

@Injectable({
    providedIn: 'root'
})
export class MockProjectService extends ProjectService {
    constructor() {
        super(null);
    }
    projects: Project[] = getTestProjects();

    lastResult: Observable<any>; // result from last method call

    getProjects(): Observable<Project[]> {
        return this.lastResult = asyncData(this.projects);
    }

    getProject(id: number): Observable<Project> {
        let project = this.projects.find(h => h.projectId === id);
        return this.lastResult = asyncData(project);

    }

    addProject(project: Project): Observable<Project> {
        return this.lastResult = this.getProject(project.projectId).pipe(
            map(h => {
                if (h) {
                    return Object.assign(h, project);
                }
                return Object.assign(new Project());
                //throw new Error(`Project ${project.projectId} not found`);
            })
        );
    }

    updateProject(project: Project): Observable<Project> {
        return this.lastResult = this.getProject(project.projectId).pipe(
            map(h => {
                if (h) {
                    return Object.assign(h, project);
                }
                return Object.assign(new Project());
                //throw new Error(`Project ${project.projectId} not found`);
            })
        );
    }
}