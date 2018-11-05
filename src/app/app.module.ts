import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { AddTaskComponent } from './add-task/add-task.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchDialogComponent } from './dialog/search.dialog.component';
import { ProjectSearchPipe } from './pipe/project.search.pipe';
import { ProjectSortPipe } from './pipe/project.sort.pipe';
import { TaskSearchPipe } from './pipe/task.search.pipe';
import { TaskSortPipe } from './pipe/task.sort.pipe';
import { UserSearchPipe } from './pipe/user.search.pipe';
import { UserSortPipe } from './pipe/user.sort.pipe';
import { ProjectComponent } from './project/project.component';
import { ProjectService } from './services/project.service';
import { TaskService } from './services/task.service';
import { UserService } from './services/user.service';
import { UserComponent } from './user/user.component';
import { ViewTaskComponent } from './view-task/view-task.component';

@NgModule({
  declarations: [
    AppComponent,    
    AddTaskComponent,
    ViewTaskComponent,
    UserComponent,
    ProjectComponent,
    SearchDialogComponent,
    UserSearchPipe,
    ProjectSearchPipe,
    TaskSearchPipe,
    UserSortPipe,
    ProjectSortPipe,
    TaskSortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BootstrapModalModule.forRoot({ container: document.body })
  ],
  entryComponents: [
    SearchDialogComponent
  ],
  providers: [TaskService, ProjectService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
