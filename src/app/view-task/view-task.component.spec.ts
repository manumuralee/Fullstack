
import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BootstrapModalModule, DialogService } from 'ng2-bootstrap-modal';
import { MockProjectService } from '../../testing/mock.project.service';
import { MockTaskService } from '../../testing/mock.task.service';
import { getTestProjects } from '../../testing/test.projects';
import { getTestTasks } from '../../testing/test.tasks';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import { ViewTaskComponent } from './view-task.component';
import { TaskSortPipe } from '../pipe/task.sort.pipe';
import { TaskSearchPipe } from '../pipe/task.search.pipe';

@Component({ selector: 'routerLink', template: '' })
class RouterOutletStubComponent { }

const TASKS = getTestTasks();
const PROJECTS = getTestProjects();
const routerSpy = jasmine.createSpyObj('Router', ['']);


describe('ViewTaskComponent', () => {
  let comp: ViewTaskComponent;
  let fix: ComponentFixture<ViewTaskComponent>;
  let endTaskEl: DebugElement[];
  let searchTextEl: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, BootstrapModalModule.forRoot({ container: document.body })],
      declarations: [ViewTaskComponent, RouterOutletStubComponent, TaskSortPipe, TaskSearchPipe],
      providers: [
        { provide: TaskService, useClass: MockTaskService },
        { provide: ProjectService, useClass: MockProjectService }        
        //{ provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fix = TestBed.createComponent(ViewTaskComponent);
    comp = fix.componentInstance;
    fix.detectChanges();
    
    comp.searchText = '';
    comp.sortingType = '';
    comp.sortValue = '';    
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should disableTask when button click', () => {
    const taskComponent = fix.debugElement.injector.get(ViewTaskComponent);
    const disableTaskCompSpy = spyOn(taskComponent, 'disableTask').and.callThrough();
    taskComponent.tasks = TASKS;
    fix.detectChanges();
    endTaskEl = fix.debugElement.queryAll(By.css('.endTaskButton'));
    endTaskEl[0].triggerEventHandler('click', null);
    expect(disableTaskCompSpy.calls.any()).toBe(true, 'component  disableTask called');
  });


  it('should searchTasks when input blur- all data', () => {
    const taskComponent = fix.debugElement.injector.get(ViewTaskComponent);
    const searchTasksCompSpy = spyOn(taskComponent, 'searchProject').and.callThrough();
    taskComponent.tasks = TASKS;
    taskComponent.projects = PROJECTS;
    fix.detectChanges();
    endTaskEl = fix.debugElement.queryAll(By.css('#searchButton'));
    endTaskEl[0].triggerEventHandler('click', null);
    fix.detectChanges();
    searchTextEl = fix.debugElement.query(By.css('#searchText'));
    searchTextEl.triggerEventHandler('blur', null);
    expect(searchTasksCompSpy.calls.any()).toBe(true, 'component  searchTasks called');
  });

  it('should sortBy when click start date', () => {
    const taskComponent = fix.debugElement.injector.get(ViewTaskComponent);
    const searchTasksCompSpy = spyOn(taskComponent, 'sortBy').and.callThrough();
    taskComponent.tasks = TASKS;
    taskComponent.projects = PROJECTS;
    taskComponent.sortOrder = 'asc';
    taskComponent.sortOrderFirst = 'asc';
    fix.detectChanges();
    let searchButton = fix.debugElement.query(By.css('#sortStartDate'));
    searchButton.triggerEventHandler('click', null);
    expect(searchTasksCompSpy.calls.any()).toBe(true, 'component  sortBy called');
  });

  it('should sortBy when click end date', () => {
    const taskComponent = fix.debugElement.injector.get(ViewTaskComponent);
    const searchTasksCompSpy = spyOn(taskComponent, 'sortBy').and.callThrough();
    taskComponent.tasks = TASKS;
    taskComponent.projects = PROJECTS;
    taskComponent.sortOrder = 'asc';
    taskComponent.sortOrderLast = 'asc';
    fix.detectChanges();
    let searchButton = fix.debugElement.query(By.css('#sortEndDate'));
    searchButton.triggerEventHandler('click', null);
    expect(searchTasksCompSpy.calls.any()).toBe(true, 'component  sortBy called');
  });

  it('should sortBy when click sort priority', () => {
    const taskComponent = fix.debugElement.injector.get(ViewTaskComponent);
    const searchTasksCompSpy = spyOn(taskComponent, 'sortBy').and.callThrough();
    taskComponent.tasks = TASKS;
    taskComponent.projects = PROJECTS;
    taskComponent.sortOrder = 'asc';
    taskComponent.sortOrderpriority = 'asc';
    fix.detectChanges();
    let searchButton = fix.debugElement.query(By.css('#sortPriority'));
    searchButton.triggerEventHandler('click', null);
    expect(searchTasksCompSpy.calls.any()).toBe(true, 'component  sortBy called');
  });

  it('should sortBy when click sort status', () => {
    const taskComponent = fix.debugElement.injector.get(ViewTaskComponent);
    const searchTasksCompSpy = spyOn(taskComponent, 'sortBy').and.callThrough();
    taskComponent.tasks = TASKS;
    taskComponent.projects = PROJECTS;
    taskComponent.sortOrder = 'asc';
    taskComponent.sortOrderStatus = 'asc';
    fix.detectChanges();
    let searchButton = fix.debugElement.query(By.css('#sortStatus'));
    searchButton.triggerEventHandler('click', null);
    expect(searchTasksCompSpy.calls.any()).toBe(true, 'component  sortBy called');
  });

});




