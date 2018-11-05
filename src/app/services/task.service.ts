import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiConfig } from '../../config/api.config';
import { ParentTask } from '../model/parent-task';
import { Task } from '../model/task';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public errorCode: String;

  private httpHeader = ApiConfig.HTTP_HEADERS;
  taskApiUrl = ApiConfig.TASK_API_URL;

  constructor(private http: HttpClient) { }

  /**
   * 
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.taskApiUrl + 'get')
      .pipe(
        tap(tasks => this.log(`fetched tasks`)),
        catchError(this.handleError('getTasks', []))
      ) as Observable<Task[]>;
  }

  /**
   * 
   * @param id 
   */
  getTask(id: number): Observable<Task> {
    const url = `${this.taskApiUrl}/${id}`;
    return this.http.get<Task>(url).pipe(
      tap(user => this.log(`fetched taks id=${id}`)),
      catchError(this.handleError<any>(`getTask id=${id}`))
    );

  }

  /**
   * 
   * @param task 
   */
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.taskApiUrl + 'create', task, this.httpHeader).pipe(
      tap((task: Task) => this.log(`added task w/ id=${task.taskId}`)),
      catchError(this.handleError<any>('add Task'))
    );
  }

  /**
   * 
   * @param task 
   */
  updateTask(task: Task): Observable<any> {
    return this.http.put<Task>(this.taskApiUrl + 'update', task, this.httpHeader).pipe(
      tap((task: Task) => this.log(`updated task w/ id=${task.taskId}`)),
      catchError(this.handleError<any>('updateTask'))
    );
  }  

  getParentTasks(): Observable<ParentTask[]> {
    return this.http.get<ParentTask[]>(this.taskApiUrl + 'getParents')
      .pipe(
        tap(tasks => this.log(`fetched parent tasks`)),
        catchError(this.handleError('getParentTasks', []))
      );
  }

  /**
  * 
  * @param task 
  */
  endTask(task: Task | number): Observable<any> {
    const id = typeof task === 'number' ? task : task.taskId;
    const url = `${this.taskApiUrl}endTask/${id}`;
    return this.http.put<Task>(url, this.httpHeader).pipe(
      tap((task: Task) => this.log(`endTask task w/ id=${id}`)),
      catchError(this.handleError<any>('endTask'))
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

  /** Log a TaskService message  */
  private log(message: string) {
    console.log('TaskService: ' + message);
  }

}
