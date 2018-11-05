import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';
import { SearchDialogComponent } from '../dialog/search.dialog.component';
import { Project } from '../model/project';
import { Search } from '../model/search';
import { Task } from '../model/task';
import { ProjectService } from '../services/project.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit, OnDestroy {

  @Input() search: Search;
  tasks: Task[];
  erroMessage: string = '';
  projects: Project[];

  searchText: string = '';
  sortingType: string = '';
  sortValue: string = '';
  sortOrder = 'asc';
  sortOrderFirst: string = 'asc';
  sortOrderLast: string = 'asc';
  sortOrderpriority: string = 'asc';
  sortOrderStatus: string = 'asc';


  constructor(public taskService: TaskService,
    private projectService: ProjectService,
    private dialogService: DialogService) {
  }

  ngOnInit() {
    this.erroMessage = '';
    this.search = new Search();
    this.tasks = new Array<Task>();
    this.getTasks();
    this.getProjects();
  }

  /**
   * getTasks
   */
  getTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      //console.log(this.tasks);
    });
  }

  /**
   * getProjects
   */
  getProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
    });
  }

  /**
   * onSave
   */
  disableTask(endtask: Task) {
    this.erroMessage = '';
    this.taskService.endTask(endtask).subscribe(task => {
      if (task) {
        if (this.tasks && this.tasks.length > 0) {
          for (let i = 0; i < this.tasks.length; i++) {
            if (task.taskId === this.tasks[i].taskId) {
              this.tasks[i].status = task.status;
              break;
            }
          }
        }
      } else {
        this.erroMessage = 'Task not updated';
        setTimeout(() => {
          this.erroMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * searchProject
   */
  searchProject() {
    let projectSearch = { 'title': 'Search Project', 'searchType': 'project', 'users': [], 'projects': this.projects, 'parents': [] };
    this.dialogService.addDialog(SearchDialogComponent, projectSearch)
      .subscribe((selectedProject: Project) => {
        if (selectedProject) {
          this.searchText = selectedProject.projectName;
        }
      });
  }

  /**
   * sortBy
   * @param sortType 
   */
  sortBy(sortType: string) {
    this.sortingType = sortType;
    if (sortType === 'startDate') {
      this.sortOrder = this.sortOrderFirst === 'desc' ? 'asc' : 'desc';
      this.sortOrderFirst = this.sortOrder;
      return;
    }
    if (sortType === 'endDate') {
      this.sortOrder = this.sortOrderLast === 'desc' ? 'asc' : 'desc';
      this.sortOrderLast = this.sortOrder;
      return;
    }
    if (sortType === 'priority') {
      this.sortOrder = this.sortOrderpriority === 'desc' ? 'asc' : 'desc';
      this.sortOrderpriority = this.sortOrder;
      return;
    }
    if (sortType === 'status') {
      this.sortOrder = this.sortOrderStatus === 'desc' ? 'asc' : 'desc';
      this.sortOrderStatus = this.sortOrder;
      return;
    }
  }


  ngOnDestroy(): void { }

}
