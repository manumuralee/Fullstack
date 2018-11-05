
// import * as _ from "lodash";
import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as _ from "lodash";
import { DialogService } from 'ng2-bootstrap-modal';
import { Subject } from 'rxjs';
import { SearchDialogComponent } from '../dialog/search.dialog.component';
import { ParentTask } from '../model/parent-task';
import { Project } from '../model/project';
import { Task } from '../model/task';
import { User } from '../model/user';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit, OnDestroy {

  @Input() model: Task;

  title: String;
  editMode: boolean;
  successFlag: Number;
  successMessage: String;
  parentTasks: ParentTask[];
  parentTaskArray: String[];
  parentTasksGroup: any = [];

  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject();

  projects: Project[];
  users: User[];
  isParentTask: boolean;
  iStartDate: any;
  iEndDate: any;
  newStartDate: any;
  newEndDate: any;

  selectedUser: string;
  selectedProject: string;
  selectedParent: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private location: Location,
    private projectService: ProjectService,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {

    this.isParentTask = false;
    this.successFlag = 0;
    this.successMessage = '';
    this.editMode = false;    
    //const id = +this.route.snapshot.paramMap.get('id');
    this.getParentTasks();
    this.getProjects();
    this.getUsers();
    this.title = "Add Task";
    this.newTask();
    this.route.paramMap.subscribe(pmap => this.editTask(+pmap.get('id')));
  }

  /**
   * new Task
   */
  newTask() {
    this.taskService.errorCode = '';
    this.successFlag = 0;
    this.successMessage = '';
    this.model = new Task();
  }

  /**
  * get Tasks
  */
  editTask(id: number): void {
    if (id) {
      this.editMode = true;
      this.taskService.getTask(id)
        .subscribe((task) => {
          this.model = task;
          if (task) {
            this.isParentTask = this.model.isParent === 1 ? true : false;            
            if (task.user) {
              this.selectedUser = task.user.firstName + ' ' + task.user.lastName;
            }
            if (task.project) {
              this.selectedProject = task.project.projectName;
            }
            if (task.parentTask) {
              this.selectedParent = task.parentTask.parentName;
            }
            if (task.startDate && task.startDate != '') {
              this.iStartDate = moment(task.startDate, 'DD/MM/YYYY', false).format('YYYY-MM-DD');
            }
            if (task.endDate && task.endDate != '') {
              this.iEndDate = moment(task.endDate, 'DD/MM/YYYY', false).format('YYYY-MM-DD');
            }
          }
          this.title = "Edit Task";
        });
    }
  }

  /**
  * 
  */
  getProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  /**
   * 
   */
  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  searchUser() {
    let userSearch = { 'title': 'Search User', 'searchType': 'user', 'users': this.users, 'projects': [], 'parents': [] };
    this.dialogService.addDialog(SearchDialogComponent, userSearch)
      .subscribe((selectedUser: User) => {
        //We get dialog result
        this.model.user = selectedUser;
        if (selectedUser) {
          this.selectedUser = selectedUser.firstName + ' ' + selectedUser.lastName;
        }
      });
  }

  searchProject() {
    let filterdProjects = this.projects.filter(project => {
      return (project.status === 0);
    });
    let projectSearch = { 'title': 'Search Project', 'searchType': 'project', 'users': [], 'projects': filterdProjects, 'parents': [] };
    this.dialogService.addDialog(SearchDialogComponent, projectSearch)
      .subscribe((selectedProject: Project) => {
        //We get dialog result
        this.model.project = selectedProject;
        if (selectedProject) {
          this.selectedProject = selectedProject.projectName;
        }
      });
  }

  searchParent() {
    let parentSearch = { 'title': 'Search Parent', 'searchType': 'parent', 'users': [], 'projects': [], 'parents': this.parentTasks };
    this.dialogService.addDialog(SearchDialogComponent, parentSearch)
      .subscribe((selectedParent: ParentTask) => {
        //We get dialog result
        this.model.parentTask = selectedParent;
        if (selectedParent) {
          this.selectedParent = selectedParent.parentName;
        }
      });
  }



  oncheckParentChange(eve: any) {
    if (eve) {
      //this.iStartDate = moment().format('YYYY-MM-DD');
      //this.iEndDate = moment().add(1, 'day').format('YYYY-MM-DD');
      this.iStartDate = null;
      this.iEndDate = null;
    }
  }

  /**
  * get Parent Tasks
  */
  getParentTasks(): void {
    this.taskService.getParentTasks().subscribe(parentTasks => {
      this.parentTasks = parentTasks;
      this.dtTrigger.next();
    });
  }

  /**
   * onSubmit
   */
  onSubmit() {
    this.taskService.errorCode = '';
    this.model.isParent = 0;
    if (this.isParentTask) {
      this.model.isParent = 1;
    } else {
      this.model.startDate = moment(this.iStartDate, 'YYYY-MM-DD', false).format('DD/MM/YYYY');
      this.model.endDate = moment(this.iEndDate, 'YYYY-MM-DD', false).format('DD/MM/YYYY');
    }

    if (this.editMode) {
      this.onUpdate();
    } else {
      this.onSave();
    }
  }

  /**
   * onSave
   */
  onSave() {
    this.taskService.addTask(this.model).subscribe(task => {
      if (task) {
        this.successFlag = 1;
        this.successMessage = 'Task "' + task.taskName + '" Successfully Saved';
        setTimeout(() => {
          this.successFlag = 0;
        }, 5000);
      } else {
        this.successFlag = 2;
        this.successMessage = 'Failed to save task "' + this.model.taskName + '"';
        if (this.taskService.errorCode && this.taskService.errorCode === 'E003') {
          this.successMessage = 'Duplicate Task  "' + this.model.taskName + '"';
          this.taskService.errorCode === ''
        }
        if (this.taskService.errorCode && this.taskService.errorCode === 'E008') {
          this.successMessage = 'Invalid Date';
          this.taskService.errorCode === ''
        }
      }
    });
  }

  /**
   * onUpdate
   */
  onUpdate() {
    this.taskService.updateTask(this.model).subscribe(task => {
      if (task) {
        this.successFlag = 1;
        this.successMessage = 'Task "' + task.taskName + '" Successfully Updated';
        setTimeout(() => {
          this.successFlag = 0;
        }, 5000);
      } else {
        this.successFlag = 2;
        this.successMessage = 'Failed to update task "' + this.model.taskName + '"';
        if (this.taskService.errorCode && this.taskService.errorCode === 'E003') {
          this.successMessage = 'Duplicate Task  "' + this.model.taskName + '"';
          this.taskService.errorCode === ''
        }
      }
    });
  }


  ngOnDestroy(): void {
    if (this.dtTrigger) {
      this.dtTrigger.unsubscribe();
    }
  }

}
