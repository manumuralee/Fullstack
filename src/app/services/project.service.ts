import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Project } from '../model/project';

import { ApiConfig } from '../../config/api.config';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public errorCode: String;

  private httpHeader = ApiConfig.HTTP_HEADERS;
  projectApiUrl = ApiConfig.PROJECT_API_URL;

  constructor(private http: HttpClient) { }

  /**
   * 
   */
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.projectApiUrl + 'get')
      .pipe(
        tap(projects => this.log(`fetched projects`)),
        catchError(this.handleError('getProjects', []))
      ) as Observable<Project[]>;
  }

  /**
   * 
   * @param id 
   */
  getProject(id: number): Observable<Project> {
    const url = `${this.projectApiUrl}/${id}`;
    return this.http.get<Project>(url).pipe(
      tap(project => this.log(`fetched project id=${id}`)),
      catchError(this.handleError<any>(`getProject id=${id}`))
    );

  }

  /**
   * 
   * @param project 
   */
  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.projectApiUrl + 'create', project, this.httpHeader).pipe(
      tap((newproject: Project) => this.log(`added project w/ id=${project.projectId}`)),
      catchError(this.handleError<any>('add Project'))
    );
  }

  /**
   * 
   * @param project 
   */
  updateProject(project: Project): Observable<any> {
    return this.http.put<Project>(this.projectApiUrl + 'update', project, this.httpHeader).pipe(
      tap((updatedproject: Project) => this.log(`updated project w/ id=${project.projectId}`)),
      catchError(this.handleError<any>('updateProject'))
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

  /** Log a ProjectService message  */
  private log(message: string) {
    console.log('ProjectService: ' + message);
  }

}
