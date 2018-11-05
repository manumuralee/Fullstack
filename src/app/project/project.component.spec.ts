import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterTestingModule } from 'node_modules/@angular/router/testing';
import { BootstrapModalModule, DialogService } from 'node_modules/ng2-bootstrap-modal';
import { MockDialogService } from '../../testing/mock.dialog.service';
import { MockProjectService } from '../../testing/mock.project.service';
import { MockUserService } from '../../testing/mock.user.service';
import { getTestProjects } from '../../testing/test.projects';
import { ProjectSearchPipe } from '../pipe/project.search.pipe';
import { ProjectSortPipe } from '../pipe/project.sort.pipe';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { ProjectComponent } from './project.component';
import { getTestUsers } from '../../testing/test.users';


@Component({ selector: 'routerLink', template: '' })
class RouterOutletStubComponent { }

const PROJECTS = getTestProjects();
const USERS = getTestUsers();

describe('ProjectComponent', () => {
    let component: ProjectComponent;
    let fixture: ComponentFixture<ProjectComponent>;
    let submitEl: DebugElement;
    let projectNameEl: DebugElement;
    let page: Page;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProjectComponent, RouterOutletStubComponent, ProjectSortPipe, ProjectSearchPipe],
            imports: [FormsModule, RouterTestingModule, NgSelectModule, BootstrapModalModule.forRoot({ container: document.body })],
            providers: [
                { provide: ProjectService, useClass: MockProjectService },
                { provide: UserService, useClass: MockUserService },
                { provide: DialogService, useClass: MockDialogService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        submitEl = fixture.debugElement.query(By.css('#SubmitVal'));
        projectNameEl = fixture.debugElement.query(By.css('#projectName'));
        page = new Page(fixture);

        component.projects = PROJECTS;
        component.users = USERS;
        component.searchText = '';
        component.sortingType = '';
        component.sortValue = '';
        component.selectedUserName = '';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Setting enabled to false disabled the submit button', () => {
        fixture.detectChanges();
        expect(submitEl.nativeElement.disabled).toBeFalsy();
    });

    it('Entering project name   event', () => {
        component.ngOnInit();
        projectNameEl.nativeElement.value = "Project1";
        expect(projectNameEl.nativeElement.value).toBe('Project1');
        component.model.projectName = 'Project1';
        fixture.detectChanges();
        submitEl.triggerEventHandler('click', null);
        expect(component.model.projectName).toBe("Project1");
    });

    it('should be checked when clicked', fakeAsync(() => {
        let fixture = TestBed.createComponent(ProjectComponent);
        let component = fixture.componentInstance;
        fixture.detectChanges();
        tick();

        let inputEl = fixture.debugElement.query(By.css("#checkDate")).nativeElement;
        inputEl.click();
        fixture.detectChanges();
        expect(component.checkDate).toBe(true);
    }));

    it('should searchUser when clicks user search button', () => {
        const searchUserCompSpy = spyOn(component, 'searchUser').and.callThrough();
        fixture.detectChanges();
        let searchUserB = fixture.debugElement.query(By.css('#searchUserButton'));
        searchUserB.triggerEventHandler('click', null);
        expect(searchUserCompSpy.calls.any()).toBe(true, 'component  searchUser called');
    });

    it('should save when click Submit ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onSave' method.
        // It delegates to fake `projectComponent.onSave` which delivers a safe test result.
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const onSubmitSpy = spyOn(projectComponent, 'onSubmit').and.callThrough();
        const onSaveSpy = spyOn(projectComponent, 'onSave').and.callThrough();
        projectComponent.model = PROJECTS[0];
        component.checkDate = true;
        fixture.detectChanges();
        click(page.saveBtn);
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onSaveSpy.calls.any()).toBe(true, 'ProjectService.save called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should update when click update ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onUpdate'method.
        // It delegates to fake `projectComponent.onUpdate` which delivers a safe test result.
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const onSubmitSpy = spyOn(projectComponent, 'onSubmit').and.callThrough();
        const onUpdateSpy = spyOn(projectComponent, 'onUpdate').and.callThrough();
        projectComponent.editMode = true;
        projectComponent.model = PROJECTS[0];
        fixture.detectChanges();
        click(page.updateBtn);
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onUpdateSpy.calls.any()).toBe(true, 'ProjectService.onUpdate called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should not save when click Submit ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onSave' method.
        // It delegates to fake `projectComponent.onSave` which delivers a safe test result.
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const onSubmitSpy = spyOn(projectComponent, 'onSubmit').and.callThrough();
        const onSaveSpy = spyOn(projectComponent, 'onSave').and.callThrough();
        projectComponent.model = PROJECTS[0];
        projectComponent.model.projectId = 0;
        fixture.detectChanges();
        click(page.saveBtn);
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onSaveSpy.calls.any()).toBe(true, 'ProjectService.save called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should not update when click update ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onUpdate'method.
        // It delegates to fake `projectComponent.onUpdate` which delivers a safe test result.
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const onSubmitSpy = spyOn(projectComponent, 'onSubmit').and.callThrough();
        const onUpdateSpy = spyOn(projectComponent, 'onUpdate').and.callThrough();
        projectComponent.editMode = true;
        projectComponent.model = PROJECTS[0];
        projectComponent.model.projectId = 0;
        fixture.detectChanges();
        click(page.updateBtn);
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onUpdateSpy.calls.any()).toBe(true, 'ProjectService.onUpdate called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });


    it('should suspendProject when button click', () => {
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const suspendProjectCompSpy = spyOn(projectComponent, 'suspendProject').and.callThrough();
        projectComponent.model = PROJECTS[1];
        fixture.detectChanges();
        let endProjectEl = fixture.debugElement.queryAll(By.css('.buttonSuspend'));
        endProjectEl[0].triggerEventHandler('click', null);
        expect(suspendProjectCompSpy.calls.any()).toBe(true, 'component suspendProject called');
    });

    it('should editProject when button click', () => {
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const editProjectCompSpy = spyOn(projectComponent, 'editProject').and.callThrough();
        projectComponent.model = PROJECTS[1];
        fixture.detectChanges();
        let endProjectEl = fixture.debugElement.queryAll(By.css('.editButton'));
        endProjectEl[0].triggerEventHandler('click', null);
        expect(editProjectCompSpy.calls.any()).toBe(true, 'component editProject called');
    });


    it('should sortBy when click Start Date button', () => {
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const searchProjectsCompSpy = spyOn(projectComponent, 'sortBy').and.callThrough();
        projectComponent.sortOrder = 'asc';
        projectComponent.sortOrderLast = 'asc';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#sortStartDate'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component sortBy called');
    });

    it('should sortBy when click End Date button', () => {
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const searchProjectsCompSpy = spyOn(projectComponent, 'sortBy').and.callThrough();
        projectComponent.sortOrder = 'asc';
        projectComponent.sortOrderFirst = 'asc';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#sortEndDate'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component searchProjects called');
    });

    it('should sortBy when click Priority button', () => {
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const searchProjectsCompSpy = spyOn(projectComponent, 'sortBy').and.callThrough();
        projectComponent.sortOrder = 'asc';
        projectComponent.sortOrderFirst = 'asc';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#sortPriority'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component searchProjects called');
    });

    it('should sortBy when click Status button', () => {
        const projectComponent = fixture.debugElement.injector.get(ProjectComponent);
        const searchProjectsCompSpy = spyOn(projectComponent, 'sortBy').and.callThrough();
        projectComponent.sortOrder = 'asc';
        projectComponent.sortOrderEmpId = 'asc';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#sortStatus'));
        searchButton.triggerEventHandler('click', null);
        expect(searchProjectsCompSpy.calls.any()).toBe(true, 'component sortBy called');
    });
});


class Page {
    // getter properties wait to query the DOM until called.
    // get buttons() { return this.queryAll<HTMLButtonElement>('button'); }
    //get saveBtn() { return this.buttons[0]; }
    get saveBtn() { return this.query<HTMLButtonElement>('#SubmitVal'); }
    get updateBtn() { return this.query<HTMLButtonElement>('#updateButton'); }

    get cancelBtn() { return this.query<HTMLButtonElement>('#resetButton'); }
    //get updateBtn() { return this.buttons[1]; }
    //get cancelBtn() { return this.buttons[1]; }
    get nameDisplay() { return this.query<HTMLElement>('span'); }
    get nameInput() { return this.query<HTMLInputElement>('input'); }

    onSaveSpy: jasmine.Spy;
    onUpdateSpy: jasmine.Spy;
    onSubmitSpy: jasmine.Spy;
    navigateSpy: jasmine.Spy;

    constructor(private fixture: ComponentFixture<ProjectComponent>) {
        // get the navigate spy from the injected router spy object
        const routerSpy = <any>fixture.debugElement.injector.get(Router);
        this.navigateSpy = routerSpy.navigate;

        // spy on component's `gotoList()` method
        const component = fixture.componentInstance;
    }

    //// query helpers ////
    private query<T>(selector: string): T {
        return this.fixture.nativeElement.querySelector(selector);
    }

    private queryAll<T>(selector: string): T[] {
        return this.fixture.nativeElement.querySelectorAll(selector);
    }
}

/** Button events to pass to `DebugElement.triggerEventHandler` for RouterLink event handler */
export const ButtonClickEvents = {
    left: { button: 0 },
    right: { button: 2 }
};

/** Simulate element click. Defaults to mouse left-button click event. */
export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void {
    if (el instanceof HTMLElement) {
        el.click();
    } else {
        el.triggerEventHandler('click', eventObj);
    }
}

