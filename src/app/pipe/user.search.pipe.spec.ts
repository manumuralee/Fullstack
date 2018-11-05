import { getTestUsers } from "../../testing/test.users";
import { UserSearchPipe } from "./user.search.pipe";

let pipe: UserSearchPipe;
const USERS = getTestUsers();
describe('UserSearchPipe', () => {
    beforeEach(() => {
        pipe = new UserSearchPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should give the details corresponding to the input', () => {
        expect(pipe.transform(USERS, 'First 2').length).toBe(1);
    });

    it('Should give full list details if the input text is empty', () => {
        expect(pipe.transform(USERS, '').length).toBe(2);
    });

    it('Should give empty  details if the input list is null', () => {
        expect(pipe.transform(null, 'Anu').length).toBe(0);
    });
});