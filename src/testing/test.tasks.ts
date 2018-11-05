import { Task } from "../app/model/task";
import { ParentTask } from "../app/model/parent-task";
import { Project } from "../app/model/project";
import { User } from "../app/model/user";

const project: Project = {
    projectId: 1, projectName: 'Task 1', startDate: '30/03/2009',
    endDate: '30/03/2010', priority: 2, taskCount: 5, closedTaskCount: 0, status: 0, user: null
};

const user: User = {
    userId: 1, firstName: 'First', lastName: 'Second',
    employeeId: 12445
};

const parent: ParentTask = { parentTaskId: 1, parentName: 'Parent Task 1', status: 0 };

/** return array of test tasks */
export function getTestTasks(): Task[] {
    return [
        {
            taskId: 1, taskName: 'Task 1', startDate: '30/03/2009',
            endDate: '30/03/2010', priority: 2, parentTask: parent, isParent: 0, status: 0, project: project, user: user
        },
        {
            taskId: 2, taskName: 'Task 2', startDate: '01/04/2016',
            endDate: '30/03/2017', priority: 5, parentTask: null, isParent: 0, status: 0, project: null, user: null
        }
    ];
}

/** return array of test tasks */
export function getParentTestTasks(): ParentTask[] {
    return [
        { parentTaskId: 1, parentName: 'Parent Task 1', status: 0 },
        { parentTaskId: 2, parentName: 'Parent Task 2', status: 0 }
    ];
}