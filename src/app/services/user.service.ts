import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../model/user';

import { ApiConfig } from '../../config/api.config';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public errorCode: String;

  private httpHeader = ApiConfig.HTTP_HEADERS;
  userApiUrl = ApiConfig.USER_API_URL;

  constructor(private http: HttpClient) { }

  /**
   * 
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userApiUrl + 'get')
      .pipe(
        tap(users => this.log(`fetched users`)),
        catchError(this.handleError('getUsers', []))
      ) as Observable<User[]>;
  }

  /**
   * 
   * @param id 
   */
  getUser(id: number): Observable<User> {
    const url = `${this.userApiUrl}/${id}`;
    return this.http.get<User>(url).pipe(
      tap(user => this.log(`fetched user id=${id}`)),
      catchError(this.handleError<any>(`getUser id=${id}`))
    );

  }

  /**
   * 
   * @param user 
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.userApiUrl + 'create', user, this.httpHeader).pipe(
      tap((newuser: User) => this.log(`added user w/ id=${user.userId}`)),
      catchError(this.handleError<any>('add User'))
    );
  }

  /**
   * 
   * @param user 
   */
  updateUser(user: User): Observable<any> {
    return this.http.put<User>(this.userApiUrl + 'update', user, this.httpHeader).pipe(
      tap((updateduser: User) => this.log(`updated user w/ id=${user.userId}`)),
      catchError(this.handleError<any>('updateUser'))
    );
  }

  /**
   * 
   * @param user 
   */
  deleteUser(user: User | number): Observable<String> {
    const id = typeof user === 'number' ? user : user.userId;
    const url = `${this.userApiUrl}${id}`;

    return this.http.delete<String>(url, this.httpHeader).pipe(
      tap(_ => this.log(`deleted user id=${id}`)),
      catchError(this.handleError<String>('deleteUser'))
    );
  }
  

  
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T) {
    return (errorResponse: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(errorResponse); // log to console instead
      if (errorResponse && errorResponse.error && errorResponse.error.messageId) {
        this.errorCode = errorResponse.error.messageId;
      } else {
        this.errorCode = '';
      }

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //private handleError (error: Response | any) {
  // console.error(error.message || error);
  // return Observable.throw(error.status);
  //  }

  /** Log a UserService message  */
  private log(message: string) {
    console.log('UserService: ' + message);
  }

}
