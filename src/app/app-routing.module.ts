import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { ProjectComponent } from './project/project.component';
import { UserComponent } from './user/user.component';
import { ViewTaskComponent } from './view-task/view-task.component';


const routes: Routes = [
  { path: '', redirectTo: '/addProject', pathMatch: 'full' }, 
  { path: 'addTask', component: AddTaskComponent },
  { path: 'viewTasks', component: ViewTaskComponent },
  { path: 'editTask/:id', component: AddTaskComponent },
  { path: 'addUser', component: UserComponent },
  { path: 'addProject', component: ProjectComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
