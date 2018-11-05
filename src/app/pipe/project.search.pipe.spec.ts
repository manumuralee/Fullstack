
import { getTestProjects } from "../../testing/test.projects";
import { ProjectSearchPipe } from "./project.search.pipe";

let pipe: ProjectSearchPipe;
const PROJECTS = getTestProjects();
describe('UserSearchPipe', () => {
    beforeEach(() => {
        pipe = new ProjectSearchPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('Should give the details corresponding to the input', () => {
        expect(pipe.transform(PROJECTS, 'Project 2').length).toBe(1);
    });
    
    it('Should give full list details if the input text is empty', () => {
        expect(pipe.transform(PROJECTS, '').length).toBe(2);
    });

    it('Should give empty  details if the input list is null', () => {
        expect(pipe.transform(null, 'First Project').length).toBe(0);
    });
});