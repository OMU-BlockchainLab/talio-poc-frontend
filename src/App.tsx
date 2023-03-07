import { ApiPromise, WsProvider } from '@polkadot/api';
import client from 'api/configClient';
import { ApiContext } from 'contexts/apiProviderContext';
import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useQuery } from 'urql';
import './App.css';
import Router from './routes/Router';
import { SnackbarProvider } from 'notistack';
import { GET_PROFILE } from 'service/auth';

export interface ProfileUser {
  userId: string;
  nickname: string;
}

export interface RoleUser {
  code: string;
  name: string;
}
export interface UserDetail {
  id: string;
  profile: ProfileUser;
  roleObj: RoleUser;
}

function App() {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  console.log('dkshf', userDetail);
  const provided = useMemo(
    () => ({
      userDetail: userDetail,
      setUserDetail: (value) => setUserDetail(value),
    }),
    [userDetail]
  );

  return (
    <SnackbarProvider maxSnack={3}>
      <ApiContext.Provider value={provided}>
        <Provider value={client}>
          <div className="App">
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </div>
        </Provider>
      </ApiContext.Provider>
    </SnackbarProvider>
  );
}

export default App;
