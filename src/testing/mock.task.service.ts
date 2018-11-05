import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ParentTask } from '../app/model/parent-task';
import { Task } from '../app/model/task';
import { TaskService } from '../app/services/task.service';
import { asyncData } from './async-observable-helpers';
import { getParentTestTasks, getTestTasks } from './test.tasks';

@Injectable({
    providedIn: 'root'
})
export class MockTaskService extends TaskService {
    constructor() {
        super(null);
    }
    tasks: Task[] = getTestTasks();
    parentTasks: ParentTask[] = getParentTestTasks();
    lastResult: Observable<any>; // result from last method call

    getTasks(): Observable<Task[]> {
        return this.lastResult = asyncData(this.tasks);
    }

    getTask(id: number): Observable<Task> {
        let task = this.tasks.find(h => h.taskId === id);
        return this.lastResult = asyncData(task);

    }

    addTask(task: Task): Observable<Task> {
        return this.lastResult = this.getTask(task.taskId).pipe(
            map(h => {
                if (h) {
                    return Object.assign(h, task);
                }
                throw new Error(`Task ${task.taskId} not found`);
            })
        );
    }

    updateTask(task: Task): Observable<Task> {
        return this.lastResult = this.getTask(task.taskId).pipe(
            map(h => {
                if (h) {
                    return Object.assign(h, task);
                }
                throw new Error(`Task ${task.taskId} not found`);
            })
        );
    }

    getParentTasks(): Observable<ParentTask[]> {
        return asyncData(this.parentTasks);
    }


    endTask(task): Observable<any> {
        const id = typeof task === 'number' ? task : task.taskId;
        return this.lastResult = this.getTask(id).pipe(
            map(h => {
                if (h) {
                    return Object.assign(h, this.getTask(id));
                }
                throw new Error('Task  not found');
            })
        );
    }
}