import { getTestProjects } from "../../testing/test.projects";
import { ProjectSortPipe } from "./project.sort.pipe";

let pipe: ProjectSortPipe;
const PROJECTS = getTestProjects();
describe('UserSearchPipe', () => {
    beforeEach(() => {
        pipe = new ProjectSortPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should give full list details if the input text is empty', () => {
        expect(pipe.transform(PROJECTS, '', 'asc').length).toBe(2);
    });
    it('Should sort the array based to the input', () => {
        expect(pipe.transform(PROJECTS, 'startDate', 'desc').length).toBe(2);
    });
    it('Should sort the array based to the input', () => {
        expect(pipe.transform(PROJECTS, 'endDate', 'desc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(PROJECTS, 'priority', 'desc').length).toBe(2);
    });

    it('Should sort the array based to the input', () => {
        expect(pipe.transform(PROJECTS, 'status', 'desc').length).toBe(2);
    });

    it('Should not sort array for wrong input', () => {
        expect(pipe.transform(PROJECTS, 'abc', 'asc').length).toBe(2);
    });

    it('Should give empty  details if the input list is null', () => {
        expect(pipe.transform(null, 'startDate', 'asc').length).toBe(0);
    });
});