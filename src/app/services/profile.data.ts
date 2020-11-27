import {FlexyData} from '@ng-flexy/core';

export interface ProfileData extends FlexyData {
  userUUID: string;
  username: string;
  userPassword?: string;

  firstName?: string;
  lastName?: string;
  roles?: string[];
  companyName?: string;
}

