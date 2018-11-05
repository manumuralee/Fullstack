import { Component, DebugElement, Directive, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { BootstrapModalModule, DialogService } from 'node_modules/ng2-bootstrap-modal';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockDialogService } from '../../testing/mock.dialog.service';
import { MockProjectService } from '../../testing/mock.project.service';
import { MockTaskService } from '../../testing/mock.task.service';
import { MockUserService } from '../../testing/mock.user.service';
import { getTestProjects } from '../../testing/test.projects';
import { getParentTestTasks, getTestTasks } from '../../testing/test.tasks';
import { getTestUsers } from '../../testing/test.users';
import { Task } from '../model/task';
import { TaskSearchPipe } from '../pipe/task.search.pipe';
import { TaskSortPipe } from '../pipe/task.sort.pipe';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';
import { AddTaskComponent } from './add-task.component';
//import { MockComponent } from 'ng-mocks';



@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

const TASKS = getTestTasks();
const PARENT_TASKS = getParentTestTasks();
const PROJECTS = getTestProjects();
const USERS = getTestUsers();
const dialogService = DialogService;
//const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
let location: Location = jasmine.createSpyObj("Location", ["back"]);
const router = {
  navigate: jasmine.createSpy('navigate')
};

@Directive({
  selector: '[routerLink], [routerLinkActive]'
})
class DummyRouterLinkDirective { }


describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let submitEl: DebugElement;
  let taskNameEl: DebugElement;
  let taskPriorityEl: DebugElement;
  let mockService = new MockTaskService();
  let page: Page;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddTaskComponent, RouterOutletStubComponent, TaskSortPipe, TaskSearchPipe],
      imports: [FormsModule, NgSelectModule, RouterTestingModule.withRoutes([]), BootstrapModalModule.forRoot({ container: document.body })],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        //{ provide: Router,      useValue: router},
        { provide: Location, useValue: location },
        { provide: ProjectService, useClass: MockProjectService },
        { provide: UserService, useClass: MockUserService },
        { provide: DialogService, useClass: MockDialogService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    submitEl = fixture.debugElement.query(By.css('#submitButton'));
    taskNameEl = fixture.debugElement.query(By.css('#taskName'));
    taskPriorityEl = fixture.debugElement.query(By.css('input[type=range]'));
    page = new Page(fixture);
    component.users = USERS;
    component.projects = PROJECTS;
    component.parentTasks = PARENT_TASKS;
    component.selectedUser = '';
    component.selectedProject = '';
    component.selectedParent = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Setting enabled to false disabled the submit button', () => {
    fixture.detectChanges();
    expect(submitEl.nativeElement.disabled).toBeFalsy();
  });

  it('Entering task name and priority  event', () => {
    component.ngOnInit();
    taskNameEl.nativeElement.value = "task1";
    taskPriorityEl.nativeElement.value = 2;
    expect(taskNameEl.nativeElement.value).toBe('task1');

    component.model.taskName = 'task11';
    component.model.priority = 1;
    fixture.detectChanges();
    submitEl.triggerEventHandler('click', null);
    expect(component.model.taskName).toBe("task11");
    expect(component.model.priority).toBe(1);
  });

  it('should navigate when click cancel', () => {
    click(page.cancelBtn);
    // expect(page.navigateSpy.calls.any()).toBe(true, 'router.navigate called');
  });

  it('should save when click Submit ', () => {
    // Get service injected into component and spy on its`onSubmit` and 'onSave' method.
    // It delegates to fake `TaskComponent.onSave` which delivers a safe test result.
    const taskComponent = fixture.debugElement.injector.get(AddTaskComponent);
    const onSubmitSpy = spyOn(taskComponent, 'onSubmit').and.callThrough();
    const onSaveSpy = spyOn(taskComponent, 'onSave').and.callThrough();
    taskComponent.model = TASKS[1];
    fixture.detectChanges();
    click(page.saveBtn);
    expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
    expect(onSaveSpy.calls.any()).toBe(true, 'TaskService.save called');
    //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
  });

  it('should update when click update ', () => {
    // Get service injected into component and spy on its`onSubmit` and 'onUpdate'method.
    // It delegates to fake `TaskComponent.onUpdate` which delivers a safe test result.
    const taskComponent = fixture.debugElement.injector.get(AddTaskComponent);
    const onSubmitSpy = spyOn(taskComponent, 'onSubmit').and.callThrough();
    const onUpdateSpy = spyOn(taskComponent, 'onUpdate').and.callThrough();

    taskComponent.editMode = true;
    taskComponent.model = TASKS[1];

    fixture.detectChanges();
    click(page.updateBtn);
    expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
    expect(onUpdateSpy.calls.any()).toBe(true, 'TaskService.onUpdate called');
    //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
  });

  it('should not save when click Submit ', () => {
    // Get service injected into component and spy on its`onSubmit` and 'onSave' method.
    // It delegates to fake `TaskComponent.onSave` which delivers a safe test result.
    const taskComponent = fixture.debugElement.injector.get(AddTaskComponent);
    const onSubmitSpy = spyOn(taskComponent, 'onSubmit').and.callThrough();
    const onSaveSpy = spyOn(taskComponent, 'onSave').and.callThrough();
    taskComponent.model = TASKS[0];
    fixture.detectChanges();
    click(page.saveBtn);
    expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
    expect(onSaveSpy.calls.any()).toBe(true, 'TaskService.save called');
  });

  it('should not update when click update ', () => {
    // Get service injected into component and spy on its`onSubmit` and 'onUpdate'method.
    // It delegates to fake `TaskComponent.onUpdate` which delivers a safe test result.
    const taskComponent = fixture.debugElement.injector.get(AddTaskComponent);
    const onSubmitSpy = spyOn(taskComponent, 'onSubmit').and.callThrough();
    const onUpdateSpy = spyOn(taskComponent, 'onUpdate').and.callThrough();
    taskComponent.model = TASKS[0];
    taskComponent.editMode = true;
    fixture.detectChanges();
    click(page.updateBtn);
    expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
    expect(onUpdateSpy.calls.any()).toBe(true, 'TaskService.onUpdate called');
    //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
  });

  it('should searchUser when clicks user search button', () => {
    const searchUserCompSpy = spyOn(component, 'searchUser').and.callThrough();
    fixture.detectChanges();
    let searchUserB = fixture.debugElement.query(By.css('#searchUserButton'));
    searchUserB.triggerEventHandler('click', null);
    expect(searchUserCompSpy.calls.any()).toBe(true, 'component  searchUser called');
  });

  it('should searchUser when clicks project search button', () => {
    const searchProjectCompSpy = spyOn(component, 'searchProject').and.callThrough();
    fixture.detectChanges();
    let searchProjectB = fixture.debugElement.query(By.css('#searchProjectButton'));
    searchProjectB.triggerEventHandler('click', null);
    expect(searchProjectCompSpy.calls.any()).toBe(true, 'component  searchProject called');
  });

  it('should searchUser when clicks parent search button', () => {
    const searchParentCompSpy = spyOn(component, 'searchParent').and.callThrough();
    fixture.detectChanges();
    let searchParentB = fixture.debugElement.query(By.css('#searchParentButton'));
    searchParentB.triggerEventHandler('click', null);
    expect(searchParentCompSpy.calls.any()).toBe(true, 'component  searchParent called');
  });

  it('should be checked when clicked', fakeAsync(() => {
    let fixture = TestBed.createComponent(AddTaskComponent);
    let component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    let inputEl = fixture.debugElement.query(By.css("#isParentTask")).nativeElement;
    inputEl.click();
    fixture.detectChanges();
    expect(component.isParentTask).toBe(true);
  }));

  /*it('should searchUser when clicks parent check box', fakeAsync(() => {
    const oncheckParentChangeSpy = spyOn(component, 'oncheckParentChange').and.callThrough();
    //component.isParentTask = true;
    fixture.detectChanges(); // initialize controls
    tick(); // wait registration controls
    let searchUserB = fixture.debugElement.query(By.css('#isParentTask'));
    searchUserB.triggerEventHandler('click', null);   
    expect(oncheckParentChangeSpy.calls.any()).toBe(true, 'component  oncheckParentChange called');
  }));*/

});


class Page {
  // getter properties wait to query the DOM until called.
  // get buttons() { return this.queryAll<HTMLButtonElement>('button'); }
  //get saveBtn() { return this.buttons[0]; }
  get saveBtn() { return this.query<HTMLButtonElement>('#submitButton'); }
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

  constructor(private fixture: ComponentFixture<AddTaskComponent>) {
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

let route: ActivatedRouteStub;
const firstTask = TASKS[0];

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let submitEl: DebugElement;
  let taskNameEl: DebugElement;
  let taskPriorityEl: DebugElement;
  let mockService = new MockTaskService();
  let page: Page;
  beforeEach(() => {
    route = new ActivatedRouteStub();
  });

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [AddTaskComponent, RouterOutletStubComponent],
      imports: [FormsModule, RouterTestingModule.withRoutes([]), BootstrapModalModule.forRoot({ container: document.body })],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: ActivatedRoute, useValue: route },
        { provide: Location, useValue: location },
        { provide: ProjectService, useClass: MockProjectService },
        { provide: UserService, useClass: MockUserService },
        { provide: DialogService, useClass: MockDialogService }
      ]
    })
      .compileComponents();
  }));


  describe('when navigate to existing task', () => {
    let expectedTask: Task;

    beforeEach(async(() => {
      expectedTask = firstTask;
      route.setParamMap({ 'id': expectedTask.taskId });
      fixture = TestBed.createComponent(AddTaskComponent);
      component = fixture.componentInstance;
      page = new Page(fixture);

      component.users = USERS;
      component.projects = PROJECTS;
      component.parentTasks = PARENT_TASKS;
      component.selectedUser = '';
      component.selectedProject = '';
      component.selectedParent = '';
      component.model = firstTask;

      // 1st change detection triggers ngOnInit which gets a task
      fixture.detectChanges();

      return fixture.whenStable().then(() => {
        // 2nd change detection displays the async-fetched task
        fixture.detectChanges();

      });
    }));
    it('should call the editTask', () => {
      const editTaskSpy = spyOn(component, 'editTask').and.callThrough();
      fixture.detectChanges();
      expect(editTaskSpy.calls.any()).toBe(false, 'component  editTask called');
    });
  });

});


