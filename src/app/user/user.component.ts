
import * as _ from "lodash";
import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { User } from '../model/user';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { NgForm } from "@angular/forms";
import { error } from "util";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  @Input() model: User;
  @ViewChild(NgForm) userForm: NgForm;

  title: String;
  editMode: boolean;
  successFlag: Number;
  successMessage: String;
  users: User[];

  searchText: string = '';
  sortingType: string = '';
  sortValue: string = '';
  sortOrder = 'asc';
  sortOrderFirst: string = 'asc';
  sortOrderLast: string = 'asc';
  sortOrderEmpId: string = 'asc';

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.title = 'Add User';
    this.editMode = false;
    this.newUser();
    this.getUsers();
  }

  /**
   * new User
   */
  newUser() {
    this.userService.errorCode = '';
    this.successFlag = 0;
    this.successMessage = '';
    this.model = new User();
  }

  /**
   * 
   */
  getUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  /**
   * disable User
   * 
   * @param event 
   * @param editUser 
   * @param index 
   */
  editUser(event: any, editUser: User, index: number) {
    this.editMode = true;
    this.model = _.cloneDeep(editUser);
    window.scrollTo(0, 0);
  }

  /**
   * onSave
   */
  deleteUser(event: any, deleteUser: User, index: number) {
    this.userService.deleteUser(deleteUser).subscribe(user => {
      this.successFlag = 1;
      this.successMessage = 'User "' + deleteUser.firstName + '" Successfully Deleted';
      this.getUsers();
    }, error => {
      this.successFlag = 2;
      this.successMessage = 'Failed to delete user "' + deleteUser.firstName + '"';
    });
  }

  /**
     * onSubmit
     */
  onSubmit() {
    this.userService.errorCode = '';    
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
    this.userService.addUser(this.model).subscribe(user => {
      if (user) {
        this.successFlag = 1;
        this.successMessage = 'User "' + user.firstName + '" Successfully Saved';
        this.getUsers();
        this.userForm.resetForm();
        this.userForm.reset();
        setTimeout(() => {
          this.newUser();
        }, 2000);
      } else {
        this.successFlag = 2;
        this.successMessage = 'Failed to save user "' + this.model.firstName + '"';
        if (this.userService.errorCode && this.userService.errorCode === 'E003') {
          this.successMessage = 'Duplicate User  "' + this.model.firstName + '"';
          this.userService.errorCode === ''
        }
        if (this.userService.errorCode && this.userService.errorCode === 'E008') {
          this.successMessage = 'Invalid Date';
          this.userService.errorCode === ''
        }
      }
    });
  }

  /**
   * onSave
   */
  onUpdate() {
    this.userService.updateUser(this.model).subscribe(user => {
      if (user) {
        this.successFlag = 1;
        this.successMessage = 'User "' + user.firstName + '" Successfully Updated';
        this.getUsers();
        this.userForm.resetForm();
        this.editMode = false;
        setTimeout(() => {
          this.newUser();
        }, 2000);
      } else {
        this.successFlag = 2;
        this.successMessage = 'Failed to update task "' + this.model.firstName + '"';
        if (this.userService.errorCode && this.userService.errorCode === 'E003') {
          this.successMessage = 'Duplicate User  "' + this.model.firstName + '"';
          this.userService.errorCode === ''
        }
      }
    });
  }

  sortBy(sortType: string) {
    this.sortingType = sortType;
    if (sortType === 'firstName') {
      this.sortOrder = this.sortOrderFirst === 'desc' ? 'asc' : 'desc';
      this.sortOrderFirst = this.sortOrder;   
      return;         
    }
    if (sortType === 'lastName') {
      this.sortOrder = this.sortOrderLast === 'desc' ? 'asc' : 'desc';
      this.sortOrderLast = this.sortOrder;       
      return;
    }
    if (sortType === 'employeeId') {
      this.sortOrder = this.sortOrderEmpId === 'desc' ? 'asc' : 'desc';
      this.sortOrderEmpId = this.sortOrder;    
      return;   
    }
  }

  ngOnDestroy(): void { }

}
