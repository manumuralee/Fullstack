
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import * as _ from "lodash";
import * as moment from 'moment';
import { DialogService } from 'ng2-bootstrap-modal';
import { SearchDialogComponent } from '../dialog/search.dialog.component';
import { Project } from '../model/project';
import { User } from '../model/user';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {

  @Input() model: Project;
  @ViewChild(NgForm) projectForm: NgForm;

  title: String;
  editMode: boolean;
  successFlag: Number;
  successMessage: String;
  projects: Project[];
  selectedUser: User;
  selectedUserName: string;
  users: User[];

  checkDate: boolean;
  iStartDate: any;
  iEndDate: any;
  newStartDate: any;
  newEndDate: any;

  searchText: string;
  sortingType: string = '';
  sortValue: string = '';
  sortOrder = 'asc';
  sortOrderFirst: string = 'asc';
  sortOrderLast: string = 'asc';
  sortOrderEmpId: string = 'asc';


  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.title = 'Add Project';
    this.resetPageDetails();
    this.resetErrorMessages();
  }

  resetPageDetails() {
    this.editMode = false;
    this.newProject();
    this.getProjects();
    this.getUsers();   
  }

  /**
   * new Project
   */
  newProject() {
    this.projectService.errorCode = '';
    this.selectedUser = null;
    this.selectedUserName = '';
    this.model = new Project();
    this.checkDate = false;
    this.model.user = null;
  }

  resetErrorMessages() {
    this.successFlag = 0;
    this.successMessage = '';
    this.projectService.errorCode = '';
  }

  /**
   * 
   */
  getProjects(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
      //console.log(this.projects);     
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

  oncheckDateChange(eve: any) {
    if (eve) {
      this.iStartDate = moment().format('YYYY-MM-DD');
      this.iEndDate = moment().add(1, 'day').format('YYYY-MM-DD');
    } else {
      this.iStartDate = null;
      this.iEndDate = null;
    }
  }

  searchUser() {
    let userSearch = { 'title': 'Search User', 'searchType': 'user', 'users': this.users, 'projects': [], 'parents': [] };
    this.dialogService.addDialog(SearchDialogComponent, userSearch)
      .subscribe((selectedUser: User) => {
        //We get dialog result
        this.selectedUser = selectedUser;
        if (selectedUser) {
          this.selectedUserName = selectedUser.firstName + ' ' + selectedUser.lastName;
        }
      });
  }

  /**
   * disable Project
   * 
   * @param event 
   * @param editProject 
   * @param index 
   */
  editProject(event: any, editProject: Project, index: number) {
    this.newProject();
    this.resetErrorMessages();
    this.editMode = true;
    this.selectedUserName = '';
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      if (editProject) {
        this.model = _.cloneDeep(editProject);        
        if (editProject.user) {
          this.selectedUser = editProject.user;
          this.selectedUserName = editProject.user.firstName + ' ' + editProject.user.lastName;
        }
        if (editProject.startDate && editProject.startDate != '') {
          this.checkDate = true;
          this.iStartDate = moment(editProject.startDate, 'DD/MM/YYYY', false).format('YYYY-MM-DD');          
        }
        if (editProject.endDate && editProject.endDate != '') {
          this.checkDate = true;
          this.iEndDate = moment(editProject.endDate, 'DD/MM/YYYY', false).format('YYYY-MM-DD');          
        }

      }
      window.scrollTo(0, 0);
    });
  }

  /**
   * onSave
   */
  suspendProject(suspendedProject: Project) {
    suspendedProject.status = 1;    
    
    this.projectService.updateProject(suspendedProject).subscribe(project => {
      if (project) {
        this.successFlag = 1;
        this.successMessage = 'Project "' + project.projectName + '" Successfully Suspended';
        this.resetPageDetails();
        this.projectForm.resetForm();
        this.projectForm.reset();
        setTimeout(() => {
          this.resetErrorMessages();
        }, 2000);
      } else {
        this.successFlag = 2;
        this.successMessage = 'Failed to suspend project "' + suspendedProject.projectName + '"';
        if (this.projectService.errorCode && this.projectService.errorCode === 'E003') {
          this.successMessage = 'Duplicate Project  "' + suspendedProject.projectName + '"';
          this.projectService.errorCode === ''
        }
      }
    });
    window.scrollTo(0, 0);
  }

  /**
     * onSubmit
     */
  onSubmit() {
    this.projectService.errorCode = '';
    this.model.user = this.selectedUser;
    if (this.checkDate) {
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
    this.projectService.addProject(this.model).subscribe(project => {
      if (project) {
        this.successFlag = 1;
        this.successMessage = 'Project "' + project.projectName + '" Successfully Saved';
        this.resetPageDetails();
        this.projectForm.resetForm();
        this.projectForm.reset();
        setTimeout(() => {
          this.resetErrorMessages();
        }, 2000);
      } else {
        this.successFlag = 2;
        this.successMessage = 'Failed to save project ';
        if (this.projectService.errorCode && this.projectService.errorCode === 'E003') {
          this.successMessage = 'Duplicate Project Name';
          this.projectService.errorCode === ''
        }
        if (this.projectService.errorCode && this.projectService.errorCode === 'E008') {
          this.successMessage = 'Invalid Date';
          this.projectService.errorCode === ''
        }
      }
    });
  }

  /**
   * onSave
   */
  onUpdate() {    
    this.projectService.updateProject(this.model).subscribe(project => {      
      if (project) {
        this.successFlag = 1;
        this.successMessage = 'Project "' + project.projectName + '" Successfully Updated';
        this.resetPageDetails();
        this.projectForm.resetForm();
        this.projectForm.reset();
        setTimeout(() => {
          this.resetErrorMessages();
        }, 2000);
      } else {
        this.successFlag = 2;
        this.successMessage = 'Failed to update project "' + this.model.projectName + '"';
        if (this.projectService.errorCode && this.projectService.errorCode === 'E003') {
          this.successMessage = 'Duplicate Project  "' + this.model.projectName + '"';
          this.projectService.errorCode === ''
        }
      }
    });
  } 

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
      this.sortOrder = this.sortOrderEmpId === 'desc' ? 'asc' : 'desc';
      this.sortOrderEmpId = this.sortOrder;
      return;
    }
    if (sortType === 'status') {
      this.sortOrder = this.sortOrderEmpId === 'desc' ? 'asc' : 'desc';
      this.sortOrderEmpId = this.sortOrder;
      return;
    }
  }


  ngOnDestroy(): void { }

}
