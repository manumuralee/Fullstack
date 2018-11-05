import { User } from "../app/model/user";

/** return array of test tasks */
export function getTestUsers(): User[] {
    return [
        {
            userId: 1, firstName: 'First', lastName: 'Second',
            employeeId: 12445
        },
        {
            userId: 2, firstName: 'First 2', lastName: 'Second 2',
            employeeId: 5654
        }
    ];
}
