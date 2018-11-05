import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterTestingModule } from 'node_modules/@angular/router/testing';
import { MockUserService } from '../../testing/mock.user.service';
import { getTestUsers } from '../../testing/test.users';
import { UserSearchPipe } from '../pipe/user.search.pipe';
import { UserSortPipe } from '../pipe/user.sort.pipe';
import { UserService } from '../services/user.service';
import { UserComponent } from './user.component';


@Component({ selector: 'routerLink', template: '' })
class RouterOutletStubComponent { }

const USERS = getTestUsers();

describe('UserComponent', () => {
    let component: UserComponent;
    let fixture: ComponentFixture<UserComponent>;
    let submitEl: DebugElement;
    let userNameEl: DebugElement; 
    let page: Page;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserComponent, RouterOutletStubComponent, UserSortPipe, UserSearchPipe],
            imports: [FormsModule, RouterTestingModule, NgSelectModule],
            providers: [
                { provide: UserService, useClass: MockUserService }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        submitEl = fixture.debugElement.query(By.css('#SubmitVal'));
        userNameEl = fixture.debugElement.query(By.css('#firstName'));
        page = new Page(fixture);

        component.users = USERS;
        component.searchText = '';
        component.sortingType = '';
        component.sortValue = '';
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Setting enabled to false disabled the submit button', () => {
        fixture.detectChanges();
        expect(submitEl.nativeElement.disabled).toBeFalsy();
    });

    it('Entering user name   event', () => {
        component.ngOnInit();
        userNameEl.nativeElement.value = "Manu";       
        expect(userNameEl.nativeElement.value).toBe('Manu');
        component.model.firstName = 'Manu';
        fixture.detectChanges();
        submitEl.triggerEventHandler('click', null);
        expect(component.model.firstName).toBe("Manu");
    });   

    it('should save when click Submit ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onSave' method.
        // It delegates to fake `userComponent.onSave` which delivers a safe test result.
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const onSubmitSpy = spyOn(userComponent, 'onSubmit').and.callThrough();
        const onSaveSpy = spyOn(userComponent, 'onSave').and.callThrough();
        userComponent.model = USERS[0];
        fixture.detectChanges();
        click(page.saveBtn);        
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onSaveSpy.calls.any()).toBe(true, 'UserService.save called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should update when click update ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onUpdate'method.
        // It delegates to fake `userComponent.onUpdate` which delivers a safe test result.
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const onSubmitSpy = spyOn(userComponent, 'onSubmit').and.callThrough();
        const onUpdateSpy = spyOn(userComponent, 'onUpdate').and.callThrough();
        userComponent.editMode = true;
        userComponent.model = USERS[0];
        fixture.detectChanges();
        click(page.updateBtn);
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onUpdateSpy.calls.any()).toBe(true, 'UserService.onUpdate called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should not save when click Submit ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onSave' method.
        // It delegates to fake `userComponent.onSave` which delivers a safe test result.
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const onSubmitSpy = spyOn(userComponent, 'onSubmit').and.callThrough();
        const onSaveSpy = spyOn(userComponent, 'onSave').and.callThrough();
        userComponent.model = USERS[0];
        userComponent.model.userId = 0;
        fixture.detectChanges();
        click(page.saveBtn);        
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onSaveSpy.calls.any()).toBe(true, 'UserService.save called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });

    it('should not update when click update ', () => {
        // Get service injected into component and spy on its`onSubmit` and 'onUpdate'method.
        // It delegates to fake `userComponent.onUpdate` which delivers a safe test result.
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const onSubmitSpy = spyOn(userComponent, 'onSubmit').and.callThrough();
        const onUpdateSpy = spyOn(userComponent, 'onUpdate').and.callThrough();
        userComponent.editMode = true;
        userComponent.model = USERS[0];
        userComponent.model.userId = 0;
        fixture.detectChanges();
        click(page.updateBtn);
        expect(onSubmitSpy.calls.any()).toBe(true, 'component  onSubmit called');
        expect(onUpdateSpy.calls.any()).toBe(true, 'UserService.onUpdate called');
        //expect(page.navigateSpy.calls.any()).toBe(false, 'router.navigate not called');
    });
    

    it('should deleteUser when button click', () => {
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const deleteUserCompSpy = spyOn(userComponent, 'deleteUser').and.callThrough();
        userComponent.model = USERS[1];
        fixture.detectChanges();
        let endUserEl = fixture.debugElement.queryAll(By.css('.deleteUserButton'));
        endUserEl[0].triggerEventHandler('click', null);
        expect(deleteUserCompSpy.calls.any()).toBe(true, 'component deleteUser called');
    });

    it('should not deleteUser when button click', () => {
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const deleteUserCompSpy = spyOn(userComponent, 'deleteUser').and.callThrough();
        userComponent.model = USERS[1];
        userComponent.model.userId = 0;
        fixture.detectChanges();
        let endUserEl = fixture.debugElement.queryAll(By.css('.deleteUserButton'));
        endUserEl[0].triggerEventHandler('click', null);
        expect(deleteUserCompSpy.calls.any()).toBe(true, 'component deleteUser called');
    });

    it('should editUser when button click', () => {
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const editUserCompSpy = spyOn(userComponent, 'editUser').and.callThrough();
        userComponent.model = USERS[1];
        fixture.detectChanges();
        let endUserEl = fixture.debugElement.queryAll(By.css('.editUserButton'));
        endUserEl[0].triggerEventHandler('click', null);
        expect(editUserCompSpy.calls.any()).toBe(true, 'component editUser called');
    });

    it('should sortBy when click first name button', () => {
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const searchUsersCompSpy = spyOn(userComponent, 'sortBy').and.callThrough();
        userComponent.sortOrder = 'asc';
        userComponent.sortOrderFirst = 'asc';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#sortfirstName'));
        searchButton.triggerEventHandler('click', null);
        expect(searchUsersCompSpy.calls.any()).toBe(true, 'component searchUsers called');
    });

    it('should sortBy when click last name button', () => {
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const searchUsersCompSpy = spyOn(userComponent, 'sortBy').and.callThrough();
        userComponent.sortOrder = 'asc';
        userComponent.sortOrderLast = 'asc';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#sortlastName'));
        searchButton.triggerEventHandler('click', null);
        expect(searchUsersCompSpy.calls.any()).toBe(true, 'component sortBy called');
    });

    it('should sortBy when click employee Id button', () => {
        const userComponent = fixture.debugElement.injector.get(UserComponent);
        const searchUsersCompSpy = spyOn(userComponent, 'sortBy').and.callThrough();
        userComponent.sortOrder = 'asc';
        userComponent.sortOrderEmpId = 'asc';
        fixture.detectChanges();
        let searchButton = fixture.debugElement.query(By.css('#sortemployeeId'));
        searchButton.triggerEventHandler('click', null);
        expect(searchUsersCompSpy.calls.any()).toBe(true, 'component sortBy called');
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

    constructor(private fixture: ComponentFixture<UserComponent>) {
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

