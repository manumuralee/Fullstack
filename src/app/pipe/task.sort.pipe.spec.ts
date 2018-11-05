import { TaskSortPipe } from "./task.sort.pipe";
import { getTestTasks } from "../../testing/test.tasks";

let pipe: TaskSortPipe;
const TASKS = getTestTasks();
describe('UserSearchPipe', () => {
    beforeEach(() => {
        pipe = new TaskSortPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should give full list details if the input text is empty', () => {
        expect(pipe.transform(TASKS, '', 'asc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(TASKS, 'startDate', 'desc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(TASKS, 'endDate', 'desc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(TASKS, 'priority', 'desc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(TASKS, 'status', 'desc').length).toBe(2);
    });

    it('Should not sort array for wrong input', () => {
        expect(pipe.transform(TASKS, 'abc', 'asc').length).toBe(2);
    });

    it('Should give empty  details if the input list is null', () => {
        expect(pipe.transform(null, 'startDate', 'asc').length).toBe(0);
    });
});