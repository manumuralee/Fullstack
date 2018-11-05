import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { asyncData } from '../../testing/async-observable-helpers';
import { getTestProjects } from '../../testing/test.projects';
import { Project } from '../model/project';
import { ProjectService } from './project.service';


const PROJECTS = getTestProjects();

describe('ProjectService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let projectService: ProjectService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProjectService]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    projectService = TestBed.get(ProjectService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', inject([ProjectService], (service: ProjectService) => {
    expect(service).toBeTruthy();
  }));

  /// ProjectService method tests begin ///
  describe('#getProjects', () => {
    let expectedProjects: Project[];
    let projectsUrl: any;

    beforeEach(() => {
      projectService = TestBed.get(ProjectService);
      projectsUrl = projectService.projectApiUrl + 'get'
      expectedProjects = PROJECTS;
    });

    it('should return expected projects (called once)', () => {
      projectService.getProjects().subscribe(
        projects => expect(projects).toEqual(expectedProjects, 'should return expected projects'),
        fail
      );

      // ProjectService should have made one request to GET projects from expected URL
      const req = httpTestingController.expectOne(projectsUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock projects
      req.flush(expectedProjects);
    });

    it('should be OK returning no projects', () => {
      projectService.getProjects().subscribe(
        projects => expect(projects.length).toEqual(0, 'should have empty projects array'),
        fail
      );

      const req = httpTestingController.expectOne(projectsUrl);
      req.flush([]); // Respond with no projects
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Not Found';
      projectService.getProjects().subscribe(
        projects => null,
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(projectsUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected projects (called multiple times)', () => {
      projectService.getProjects().subscribe();
      projectService.getProjects().subscribe();
      projectService.getProjects().subscribe(
        projects => expect(projects).toEqual(expectedProjects, 'should return expected projects'),
        fail
      );

      const requests = httpTestingController.match(projectsUrl);
      expect(requests.length).toEqual(3, 'calls to getProjects()');

      // Respond to each request with different mock project results
      requests[0].flush([]);
      requests[1].flush([PROJECTS[0]]);
      requests[2].flush(expectedProjects);
    });
  });

  describe('#updateProject', () => {
    let updateUrl: any;
    beforeEach(() => {
      projectService = TestBed.get(ProjectService);
      updateUrl = projectService.projectApiUrl + 'update';
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${updateUrl}/?id=${id}`;

    it('should update a project and return it', () => {

      let updateProject: Project = PROJECTS[0];

      projectService.updateProject(updateProject).subscribe(
        data => expect(data).toEqual(updateProject, 'should return the project'),
        fail
      );

      // ProjectService should have made one request to PUT project
      const req = httpTestingController.expectOne(updateUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateProject);

      // Expect server to return the project after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateProject });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      let updateProject: Project = PROJECTS[0];
      const msg = 'Not Found';
      projectService.updateProject(updateProject).subscribe(
        projectes => null,
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(updateUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#addProject', () => {
    let createUrl: any;
    beforeEach(() => {
      projectService = TestBed.get(ProjectService);
      createUrl = projectService.projectApiUrl + 'create';
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${createUrl}/?id=${id}`;

    it('should create a project and return it', () => {

      let addProject: Project = PROJECTS[0];

      projectService.addProject(addProject).subscribe(
        data => expect(data).toEqual(addProject, 'should return the project'),
        fail
      );

      // ProjectService should have made one request to PUT project
      const req = httpTestingController.expectOne(createUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(addProject);

      // Expect server to return the project after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: addProject });
      req.event(expectedResponse);
    });
  });

  describe('#getProject', () => {
    let getProjectUrl: any;
    beforeEach(() => {
      projectService = TestBed.get(ProjectService);
      getProjectUrl = projectService.projectApiUrl + 1;
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${projectService.projectApiUrl}?id=${id}`;
    let mockproject: Project = PROJECTS[0];

    it('should return expected project (called once)', () => {
      projectService.getProject(1).subscribe(
        project => expect(project).toEqual(mockproject, 'should return expected project'),
        fail
      );

      // ProjectService should have made one request to GET projects from expected URL      
      const req = httpTestingController.expectOne(req => req.url.includes('1'));
      // sexpect(req.request.params.has('projectId')).toBeTruthy();

      // Respond with the mock project
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: mockproject });
      req.event(expectedResponse);
    });

    it('should be OK returning no project', () => {
      projectService.getProject(2).subscribe(
        project => expect(project).toBeNull('should have no project'),
        fail
      );

      const req = httpTestingController.expectOne(req => req.url.includes('1'));
      expect(req.request.params.has('parentName')).toBeFalsy();

      // Respond with the mock project
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: null });
      req.event(expectedResponse);
    });
  });

});

describe('ProjectService (with spies)', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let projectService: ProjectService;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    projectService = new ProjectService(<any>httpClientSpy);
  });

  it('should return expected projects (HttpClient called once)', () => {
    const expectedProjects: Project[] = PROJECTS;

    httpClientSpy.get.and.returnValue(asyncData(expectedProjects));

    projectService.getProjects().subscribe(
      projects => expect(projects).toEqual(expectedProjects, 'expected projects'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});

