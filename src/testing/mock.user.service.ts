import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../app/model/user';
import { UserService } from '../app/services/user.service';
import { asyncData } from './async-observable-helpers';
import { getTestUsers } from './test.users'


@Injectable({
    providedIn: 'root'
})
export class MockUserService extends UserService {
    constructor() {
        super(null);
    }
    users: User[] = getTestUsers();

    lastResult: Observable<any>; // result from last method call

    getUsers(): Observable<User[]> {
        return this.lastResult = asyncData(this.users);
    }

    getUser(id: number): Observable<User> {
        let user = this.users.find(h => h.userId === id);
        return this.lastResult = asyncData(user);

    }

    addUser(user: User): Observable<any> {
        return this.lastResult = this.getUser(user.userId).pipe(
            map(h => {
                if (h) {
                    return Object.assign(h, user);
                }
                return Object.assign(null);
            })
        );
    }

    updateUser(user: User): Observable<any> {
        return this.lastResult = this.getUser(user.userId).pipe(
            map(h => {
                if (h) {
                    return Object.assign(h, user);
                }
                return Object.assign(null);
            })
        );
    }

    deleteUser(user: User): Observable<String> {
        return this.lastResult = this.getUser(user.userId).pipe(
            map(h => {
                if (h) {
                    return ''
                }
                return Object.assign({'error' : 'error' });
            })
        );
    }
}