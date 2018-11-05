
import { Project } from "../app/model/project";
import { User } from "../app/model/user";

const user: User = {
    userId: 1, firstName: 'First', lastName: 'Second',
    employeeId: 12445
};
/** return array of test tasks */
export function getTestProjects(): Project[] {
    return [
        {
            projectId: 1, projectName: 'Project 1', startDate: '30/03/2009',
            endDate: '30/03/2010', priority: 2, taskCount: 5, closedTaskCount: 0, status: 0, user: user
        },
        {
            projectId: 2, projectName: 'Project 2', startDate: '01/04/2016',
            endDate: '30/03/2017', priority: 5, taskCount: 6, closedTaskCount: 0, status: 0, user: null
        }
    ];
}
