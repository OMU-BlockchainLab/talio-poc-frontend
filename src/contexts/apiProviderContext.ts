import { UserDetail } from 'App';
import React from 'react';

interface UserContext {
  userDetail: UserDetail | null;
  setUserDetail: Function;
}
export const ApiContext = React.createContext<UserContext>({
  userDetail: {
    id: '',
    profile: {
      nickname: '',
      userId: '',
    },
    roleObj: {
      code: '',
      name: '',
    },
  },
  setUserDetail: (dt) => {},
});
