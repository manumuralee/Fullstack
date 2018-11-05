import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterLinkDirectiveStub, RouterLinkActiveDirectiveStub, RouterStubsModule } from '../testing/router-link-directive-stub';
import { RouterTestingModule } from 'node_modules/@angular/router/testing';

@Component({ selector: 'app-project', template: '' })
class ProjecttubComponent { }

@Component({ selector: 'router-outlet', template: '' })
class RouterOutletStubComponent { }

@Component({ selector: 'app-add-task', template: '' })
class AddTaskStubComponent { }

@Component({ selector: 'app-view-task', template: '' })
class ViewTaskStubComponent { }

@Component({ selector: 'app-user', template: '' })
class UserStubComponent { }


let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AppComponent,RouterOutletStubComponent
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
 
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Project Manager');
  }));
});


describe('AppComponent & TestModule', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        AppComponent,        
        ProjecttubComponent,
        RouterOutletStubComponent,
        AddTaskStubComponent,
        ViewTaskStubComponent,
        UserStubComponent,
        RouterLinkDirectiveStub,
        RouterLinkActiveDirectiveStub
      ]
    }).compileComponents().then(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

describe('AppComponent & NO_ERRORS_SCHEMA', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        AppComponent,
        ProjecttubComponent,
        RouterLinkDirectiveStub,
        RouterLinkActiveDirectiveStub
        
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then(() => {
        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
      });
  }));
  tests();
});

function tests() {
  let routerLinks: RouterLinkDirectiveStub[];
  let linkDes: DebugElement[];
  let routerLinkActive: RouterLinkActiveDirectiveStub[];

  beforeEach(() => {
    fixture.detectChanges(); // trigger initial data binding

    // find DebugElements with an attached RouterLinkStubDirective
    linkDes = fixture.debugElement
      .queryAll(By.directive(RouterLinkDirectiveStub));

    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('can instantiate the component', () => {
    expect(comp).not.toBeNull();
  });

  it('can get RouterLinks from template', () => {
    expect(routerLinks.length).toBe(4, 'should have 4 routerLinks');
    expect(routerLinks[0].linkParams).toBe('/addProject');
    expect(routerLinks[1].linkParams).toBe('/addTask');
    expect(routerLinks[2].linkParams).toBe('/addUser');
    expect(routerLinks[3].linkParams).toBe('/viewTasks');
  });

  it('can click add task link in template', () => {
    const taskLinkDe = linkDes[1];   // add task link DebugElement
    const addtaskLink = routerLinks[1]; // add task link directive

    expect(addtaskLink.navigatedTo).toBeNull('should not have navigated yet');

    taskLinkDe.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(addtaskLink.navigatedTo).toBe('/addTask');
  });
}
