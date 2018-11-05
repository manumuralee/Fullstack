import { getTestUsers } from "../../testing/test.users";
import { UserSearchPipe } from "./user.search.pipe";
import { UserSortPipe } from "./user.sort.pipe";

let pipe: UserSortPipe;
const USERS = getTestUsers();
describe('UserSearchPipe', () => {
    beforeEach(() => {
        pipe = new UserSortPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should give full list details if the input text is empty', () => {
        expect(pipe.transform(USERS, '', 'asc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(USERS, 'firstName', 'desc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(USERS, 'lastName', 'desc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(USERS, 'employeeId', 'desc').length).toBe(2);
    });

    it('Should not sort array for wrong input', () => {
        expect(pipe.transform(USERS, 'abc', 'asc').length).toBe(2);
    });

    it('Should give empty  details if the input list is null', () => {
        expect(pipe.transform(null, 'firstName', 'asc').length).toBe(0);
    });
});