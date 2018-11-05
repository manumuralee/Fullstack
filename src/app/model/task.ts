import { ParentTask } from "./parent-task";
import { Project } from "./project";
import { User } from "./user";

export class Task {
    taskId: number;
    taskName: string;
    startDate: string;
    endDate: string;
    priority: number;
    parentTask: ParentTask;
    isParent: number;
    status: number;
    project: Project;
    user: User;
}