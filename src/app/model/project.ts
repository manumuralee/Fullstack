import { User } from "./user";

export class Project {
    projectId: number;
    projectName: string;
    startDate: string;
    endDate: string;
    priority: number;
    user: User;
    status: number
    taskCount: number;
    closedTaskCount: number;
}