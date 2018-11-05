import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { asyncData } from '../../testing/async-observable-helpers';
import { getTestUsers } from '../../testing/test.users';
import { User } from '../model/user';
import { UserService } from './user.service';


const USERS = getTestUsers();

describe('UserService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let userService: UserService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    userService = TestBed.get(UserService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  /// UserService method tests begin ///
  describe('#getUsers', () => {
    let expectedUsers: User[];
    let usersUrl: any;

    beforeEach(() => {
      userService = TestBed.get(UserService);
      usersUrl = userService.userApiUrl + 'get'
      expectedUsers = USERS;
    });

    it('should return expected users (called once)', () => {
      userService.getUsers().subscribe(
        users => expect(users).toEqual(expectedUsers, 'should return expected users'),
        fail
      );

      // UserService should have made one request to GET users from expected URL
      const req = httpTestingController.expectOne(usersUrl);
      expect(req.request.method).toEqual('GET');

      // Respond with the mock users
      req.flush(expectedUsers);
    });

    it('should be OK returning no users', () => {
      userService.getUsers().subscribe(
        users => expect(users.length).toEqual(0, 'should have empty users array'),
        fail
      );

      const req = httpTestingController.expectOne(usersUrl);
      req.flush([]); // Respond with no users
    });

    it('should turn 404 into a user-friendly error', () => {
      const msg = 'Not Found';
      userService.getUsers().subscribe(
        users => null,
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(usersUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });

    it('should return expected users (called multiple times)', () => {
      userService.getUsers().subscribe();
      userService.getUsers().subscribe();
      userService.getUsers().subscribe(
        users => expect(users).toEqual(expectedUsers, 'should return expected users'),
        fail
      );

      const requests = httpTestingController.match(usersUrl);
      expect(requests.length).toEqual(3, 'calls to getUsers()');

      // Respond to each request with different mock user results
      requests[0].flush([]);
      requests[1].flush([USERS[0]]);
      requests[2].flush(expectedUsers);
    });
  });

  describe('#updateUser', () => {
    let updateUrl: any;
    beforeEach(() => {
      userService = TestBed.get(UserService);
      updateUrl = userService.userApiUrl + 'update';
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${updateUrl}/?id=${id}`;

    it('should update a user and return it', () => {

      let updateUser: User = USERS[0];

      userService.updateUser(updateUser).subscribe(
        data => expect(data).toEqual(updateUser, 'should return the user'),
        fail
      );

      // UserService should have made one request to PUT user
      const req = httpTestingController.expectOne(updateUrl);
      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual(updateUser);

      // Expect server to return the user after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: updateUser });
      req.event(expectedResponse);
    });

    it('should turn 404 error into user-facing error', () => {
      let updateUser: User = USERS[0];
      const msg = 'Not Found';
      userService.updateUser(updateUser).subscribe(
        useres => null,
        error => expect(error.message).toContain(msg)
      );

      const req = httpTestingController.expectOne(updateUrl);

      // respond with a 404 and the error message in the body
      req.flush(msg, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('#addUser', () => {
    let createUrl: any;
    beforeEach(() => {
      userService = TestBed.get(UserService);
      createUrl = userService.userApiUrl + 'create';
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${createUrl}/?id=${id}`;

    it('should create a user and return it', () => {

      let addUser: User = USERS[0];

      userService.addUser(addUser).subscribe(
        data => expect(data).toEqual(addUser, 'should return the user'),
        fail
      );

      // UserService should have made one request to PUT user
      const req = httpTestingController.expectOne(createUrl);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(addUser);

      // Expect server to return the user after PUT
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: addUser });
      req.event(expectedResponse);
    });
  });

  describe('#getUser', () => {
    let getUserUrl: any;
    beforeEach(() => {
      userService = TestBed.get(UserService);
      getUserUrl = userService.userApiUrl + 1;
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${userService.userApiUrl}?id=${id}`;
    let mockuser: User = USERS[0];

    it('should return expected user (called once)', () => {
      userService.getUser(1).subscribe(
        user => expect(user).toEqual(mockuser, 'should return expected user'),
        fail
      );

      // UserService should have made one request to GET users from expected URL      
      const req = httpTestingController.expectOne(req => req.url.includes('1'));
      // sexpect(req.request.params.has('userId')).toBeTruthy();

      // Respond with the mock user
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: mockuser });
      req.event(expectedResponse);
    });

    it('should be OK returning no user', () => {
      userService.getUser(2).subscribe(
        user => expect(user).toBeNull('should have no user'),
        fail
      );

      const req = httpTestingController.expectOne(req => req.url.includes('1'));
      expect(req.request.params.has('parentName')).toBeFalsy();

      // Respond with the mock user
      const expectedResponse = new HttpResponse(
        { status: 200, statusText: 'OK', body: null });
      req.event(expectedResponse);
    });
  });

  describe('#deleteUser', () => {
    let getUserUrl: any;
    beforeEach(() => {
      userService = TestBed.get(UserService);
      getUserUrl = userService.userApiUrl + 1;
    });
    // Expecting the query form of URL so should not 404 when id not found
    const makeUrl = (id: number) => `${userService.userApiUrl}?id=${id}`;
    let mockuser: User = USERS[0];


    it('should delete the correct data', () => {
      userService.deleteUser(1).subscribe((data: any) => {
        expect(data).toString();
      });
      let req = httpTestingController.expectOne(req => req.url.includes('1'));
      expect(req.request.method).toEqual('DELETE');
      const expectedResponse = new HttpResponse(
        { status: 204, statusText: 'No Content.', body: null });
      req.event(expectedResponse);
    });
  });

});

describe('UserService (with spies)', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let userService: UserService;

  beforeEach(() => {
    // TODO: spy on other methods too
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    userService = new UserService(<any>httpClientSpy);
  });

  it('should return expected users (HttpClient called once)', () => {
    const expectedUsers: User[] = USERS;

    httpClientSpy.get.and.returnValue(asyncData(expectedUsers));

    userService.getUsers().subscribe(
      users => expect(users).toEqual(expectedUsers, 'expected users'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });
});

