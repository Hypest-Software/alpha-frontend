import {ProfileData} from './profile.data';
import {FlexyModel} from '@ng-flexy/core';

// import {ROLE_ADMIN, ROLE_BILLING_MANAGER, ROLE_USER} from '../models/user-role.model';

export class Profile extends FlexyModel<ProfileData> {

  get id(): string {
    return this.data && this.data.userUUID as string;
  }

  set id(val: string) {
    this.data.userUUID = val;
  }

  get username(): string {
    return this.data && this.data.username;
  }

  get firstName(): string {
    return this.data && this.data.firstName;
  }

  set firstName(firstName: string) {
    this.data.firstName = firstName;
  }

  get lastName(): string {
    return this.data && this.data.lastName;
  }

  set lastName(lastName: string) {
    this.data.lastName = lastName;
  }

  get roles(): string[] {
    return this.data.roles;
  }

  get companyName(): string {
    return this.data && this.data.companyName;
  }

  constructor(json: ProfileData) {
    super(json);
  }

  toString() {
    return this.getFullName();
  }

  getFullName(): string {
    if (this.firstName && this.lastName) {
      return this.firstName + ' ' + this.lastName;
    }
    return this.username;
  }

  // isAdmin(): boolean {
  //   return this.data.roles.includes(ROLE_ADMIN);
  // }

}
