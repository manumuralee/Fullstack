import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapModalModule } from 'node_modules/ng2-bootstrap-modal';
import { getTestProjects } from '../../testing/test.projects';
import { getParentTestTasks } from '../../testing/test.tasks';
import { getTestUsers } from '../../testing/test.users';
import { ProjectSearchPipe } from '../pipe/project.search.pipe';
import { UserSearchPipe } from '../pipe/user.search.pipe';
import { SearchDialogComponent } from './search.dialog.component';
import { FormsModule } from '../../../node_modules/@angular/forms';

const PROJECTS = getTestProjects();
const USERS = getTestUsers();
const PARENT_TASKS = getParentTestTasks();

describe('SearchDialogComponent', () => {
    let component: SearchDialogComponent;
    let fixture: ComponentFixture<SearchDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SearchDialogComponent, UserSearchPipe, ProjectSearchPipe],
            imports: [BrowserModule, FormsModule, NgSelectModule, BootstrapModalModule.forRoot({ container: document.body })],
            providers: [],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        component.projects = PROJECTS;
        component.users = USERS;
        component.parents = PARENT_TASKS;
        component.userName = '';
        component.projectName = '';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should sortBy when click Start Date button', () => {
        const searchDialogComponent = fixture.debugElement.injector.get(SearchDialogComponent);
        const searchProjectsCompSpy = spyOn(searchDialogComponent, 'confirmUser').and.callThrough();
        searchDialogComponent.searchType = 'user';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#buttonconfirmUser'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component sortBy called');
    });

    it('should sortBy when click End Date button', () => {
        const searchDialogComponent = fixture.debugElement.injector.get(SearchDialogComponent);
        const searchProjectsCompSpy = spyOn(searchDialogComponent, 'confirmProject').and.callThrough();
        searchDialogComponent.searchType = 'project';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#buttonConfirmProject'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component searchProjects called');
    });

    it('should sortBy when click Priority button', () => {
        const searchDialogComponent = fixture.debugElement.injector.get(SearchDialogComponent);
        const searchProjectsCompSpy = spyOn(searchDialogComponent, 'confirmParent').and.callThrough();
        searchDialogComponent.searchType = 'parent';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#buttonConfirmParent'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component searchProjects called');
    });

    it('should sortBy when click Status button', () => {
        const searchDialogComponent = fixture.debugElement.injector.get(SearchDialogComponent);
        const searchProjectsCompSpy = spyOn(searchDialogComponent, 'cancel').and.callThrough();
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#buttonCancel'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component sortBy called');
    });
});
