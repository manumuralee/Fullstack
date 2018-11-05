
import { TaskSearchPipe } from "./task.search.pipe";
import { getTestTasks } from "../../testing/test.tasks";

let pipe: TaskSearchPipe;
const TASKS = getTestTasks();
describe('UserSearchPipe', () => {
    beforeEach(() => {
        pipe = new TaskSearchPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should give the details corresponding to the input', () => {
        expect(pipe.transform(TASKS, 'Task 1').length).toBe(1);
    });
    
    it('Should give full list details if the input text is empty', () => {
        expect(pipe.transform(TASKS, '').length).toBe(2);
    });

    it('Should give empty  details if the input list is null', () => {
        expect(pipe.transform(null, 'First Project').length).toBe(0);
    });
});