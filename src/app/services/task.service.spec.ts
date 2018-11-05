import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { asyncData } from '../../testing/async-observable-helpers';
import { ParentTask } from '../model/parent-task';
import { Task } from '../model/task';
import { TaskService } from './task.service';




describe('TaskService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let taskService: TaskService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    taskService = TestBed.get(TaskService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', inject([TaskService], (service: TaskService) => {
    expect(service).toBeTruthy();
  }));

  /// TaskService method tests begin ///
  describe('#getTasks', () => {
    let expectedTasks: Task[];
    let tasksUrl: any;

    beforeEach(() => {
      taskService = TestBed.get(TaskService);
      tasksUrl = taskService.taskApiUrl + 'get'
      expectedTasks =
        [
          { taskId: 1, taskName: 'Task 1', startDate: '30/03/2009', endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 0 },
          { taskId: 2, taskName: 'Task 2', startDate: '01/04/2016', endDate: '30/03/2017', priority: 5, parentTask: null, isParent: 0, status: 0 }
        ] as Task[];
    });

    it('should return expected tasks (called once)', () => {
      taskService.getTasks().subscribe(
        tasks => expect(tasks).toEqual(expectedTasks, 'should return expected tasks'),
        fail
      );

      // TaskService should have made one request to GET tasks from expected URL
      const req = httpTestingController.expectOne(tasksUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock tasks
      req.flush(expectedTasks);
    });

    it('should be OK returning no tasks', () => {
      taskService.getTasks().subscribe(
        tasks => expect(tasks.length).toEqual(0, 'should have empty tasks array'),
        fail
      );

      const req = httpTestingController.expectOne(tasksUrl);
      req.flush([]); // Respond with no tasks
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Not Found';
      taskService.getTasks().subscribe(
        tasks => null,
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(tasksUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected tasks (called multiple times)', () => {
      taskService.getTasks().subscribe();
      taskService.getTasks().subscribe();
      taskService.getTasks().subscribe(
        tasks => expect(tasks).toEqual(expectedTasks, 'should return expected tasks'),
        fail
      );

      const requests = httpTestingController.match(tasksUrl);
      expect(requests.length).toEqual(3, 'calls to getTasks()');

      // Respond to each request with different mock task results
      requests[0].flush([]);
      requests[1].flush([{ taskId: 2, taskName: 'Task 2', startDate: '01/04/2016', endDate: '30/03/2017', priority: 5, parentTask: null, isParent: 0, status: 0 }]);
      requests[2].flush(expectedTasks);
    });
  });

  describe('#updateTask', () => {
    let updateUrl: any;
    beforeEach(() => {
      taskService = TestBed.get(TaskService);
      updateUrl = taskService.taskApiUrl + 'update';
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${updateUrl}/?id=${id}`;

    it('should update a task and return it', () => {

      let updateTask: Task = {
        taskId: 1, taskName: 'Task 1', startDate: '30/03/2009',
        endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 0, project: null, user: null
      };

      taskService.updateTask(updateTask).subscribe(
        data => expect(data).toEqual(updateTask, 'should return the task'),
        fail
      );

      // TaskService should have made one request to PUT task
      const req = httpTestingController.expectOne(updateUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateTask);

      // Expect server to return the task after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateTask });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      let updateTask: Task = {
        taskId: 1, taskName: 'Task 1',
        startDate: '30/03/2009', endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 0, project: null, user: null
      };
      const msg = 'Not Found';
      taskService.updateTask(updateTask).subscribe(
        taskes => null,
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(updateUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#addTask', () => {
    let createUrl: any;
    beforeEach(() => {
      taskService = TestBed.get(TaskService);
      createUrl = taskService.taskApiUrl + 'create';
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${createUrl}/?id=${id}`;

    it('should create a task and return it', () => {

      let addTask: Task = {
        taskId: 1, taskName: 'Task 1', startDate: '30/03/2009',
        endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 0, project: null, user: null
      };

      taskService.addTask(addTask).subscribe(
        data => expect(data).toEqual(addTask, 'should return the task'),
        fail
      );

      // TaskService should have made one request to PUT task
      const req = httpTestingController.expectOne(createUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(addTask);

      // Expect server to return the task after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: addTask });
      req.event(expectedResponse);
    });
  });

  describe('#getTask', () => {
    let getTaskUrl: any;
    beforeEach(() => {
      taskService = TestBed.get(TaskService);
      getTaskUrl = taskService.taskApiUrl + 1;
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${taskService.taskApiUrl}?id=${id}`;
    let mocktask: Task = {
      taskId: 1, taskName: 'Task 1', startDate: '30/03/2009',
      endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 0, project: null, user: null
    };

    it('should return expected task (called once)', () => {
      taskService.getTask(1).subscribe(
        task => expect(task).toEqual(mocktask, 'should return expected task'),
        fail
      );

      // TaskService should have made one request to GET tasks from expected URL      
      const req = httpTestingController.expectOne(req => req.url.includes('1'));
      // sexpect(req.request.params.has('taskId')).toBeTruthy();

      // Respond with the mock task
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: mocktask });
      req.event(expectedResponse);
    });

    it('should be OK returning no task', () => {
      taskService.getTask(2).subscribe(
        task => expect(task).toBeNull('should have no task'),
        fail
      );

      const req = httpTestingController.expectOne(req => req.url.includes('1'));
      expect(req.request.params.has('parentName')).toBeFalsy();

      // Respond with the mock task
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: null });
      req.event(expectedResponse);
    });
  });

  describe('#deleteTask', () => {
    let getTaskUrl: any;
    beforeEach(() => {
      taskService = TestBed.get(TaskService);
      getTaskUrl = taskService.taskApiUrl + 1;
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${taskService.taskApiUrl}?id=${id}`;
    let mocktask: Task = {
      taskId: 1, taskName: 'Task 1', startDate: '30/03/2009',
      endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 0, project: null, user: null
    };


  });

  describe('#getParentTasks', () => {
    let expectedTasks: ParentTask[];
    let tasksUrl: any;

    beforeEach(() => {
      taskService = TestBed.get(TaskService);
      tasksUrl = taskService.taskApiUrl + 'getParents'
      expectedTasks =
        [
          { parentTaskId: 1, parentName: 'Parent Task 1', status: 0 },
          { parentTaskId: 2, parentName: 'Parent Task 2', status: 0 }
        ] as ParentTask[];
    });

    it('should return expected parent tasks (called once)', () => {
      taskService.getParentTasks().subscribe(
        tasks => expect(tasks).toEqual(expectedTasks, 'should return expected parent tasks'),
        fail
      );

      // TaskService should have made one request to GET tasks from expected URL
      const req = httpTestingController.expectOne(tasksUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock tasks
      req.flush(expectedTasks);
    });

    it('should be OK returning no tasks', () => {
      taskService.getParentTasks().subscribe(
        tasks => expect(tasks.length).toEqual(0, 'should have empty Parent tasks array'),
        fail
      );

      const req = httpTestingController.expectOne(tasksUrl);
      req.flush([]); // Respond with no tasks
    });

    it('should return expected Parent tasks (called multiple times)', () => {
      taskService.getParentTasks().subscribe();
      taskService.getParentTasks().subscribe();
      taskService.getParentTasks().subscribe(
        tasks => expect(tasks).toEqual(expectedTasks, 'should return expected Parent tasks'),
        fail
      );

      const requests = httpTestingController.match(tasksUrl);
      expect(requests.length).toEqual(3, 'calls to getParentTasks()');

      // Respond to each request with different mock task results
      requests[0].flush([]);
      requests[1].flush([{ parentTaskId: 2, parentName: 'Parent Task 2' }]);
      requests[2].flush(expectedTasks);
    });
  });

  ////endTask
  describe('#endTask', () => {
    let updateUrl: any;
    beforeEach(() => {
      taskService = TestBed.get(TaskService);
      updateUrl = taskService.taskApiUrl + 'endTask/1';
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${updateUrl}endTask/=${id}`;

    it('should end a task and return it', () => {

      let endTask: Task = {
        taskId: 1, taskName: 'Task 1', startDate: '30/03/2009',
        endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 1, project: null, user: null
      };

      taskService.endTask(endTask).subscribe(
        data => expect(data).toEqual(endTask, 'should return the task'),
        fail
      );

      // TaskService should have made one request to PUT task
      let req = httpTestingController.expectOne(updateUrl);
      // Expect server to return the task after PUT
      let expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: endTask });
      req.event(expectedResponse);
      expect(req.request.method).toEqual('PUT');
      //expect(req.request.body).toEqual(endTask);

    });

    it('should turn 404 error into user-facing error', () => {
      let updateTask: Task = {
        taskId: 1, taskName: 'Task 1',
        startDate: '30/03/2009', endDate: '30/03/2010', priority: 2, parentTask: null, isParent: 0, status: 0, project: null, user: null
      };
      let msg = 'Not Found';
      taskService.endTask(updateTask).subscribe(
        task => null,
        error => expect(error.message).toContain(msg)
      );

      let req = httpTestingController.expectOne(updateUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });
});

describe('TaskService (with spies)', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let taskService: TaskService;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    taskService = new TaskService(<any>httpClientSpy);
  });

  it('should return expected tasks (HttpClient called once)', () => {
    const expectedTasks: Task[] =
      [
        {
          taskId: 1, taskName: 'Task 1', startDate: '30/03/2009', endDate: '30/03/2010',
          priority: 2, parentTask: null, isParent: 0, status: 0, project: null, user: null
        },
        {
          taskId: 2, taskName: 'Task 2', startDate: '01/04/2016', endDate: '30/03/2017',
          priority: 5, parentTask: null, isParent: 0, status: 0, project: null, user: null
        }
      ];

    httpClientSpy.get.and.returnValue(asyncData(expectedTasks));

    taskService.getTasks().subscribe(
      tasks => expect(tasks).toEqual(expectedTasks, 'expected tasks'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});

