import * as React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';
import { wixAxiosConfig } from '@wix/wix-axios-config';
import App from './components/App';
import { User } from './components/App/App';
import * as cookie from 'cookie';

const baseURL = window.__BASEURL__;
const user = JSON.parse(window.__USER__) as User;

export const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';

wixAxiosConfig(axios, { baseURL });

const createHeaders = () => ({
  headers: {
    'Content-Type': 'application/json',
    // [XSRF_HEADER_NAME]: cookie.parse(document.cookie)['XSRF-TOKEN'],
  },
});

const login = (username, password, isNew) => {
  return axios
    .post(
      isNew ? '/signup' : '/login',
      {
        username,
        password,
      },
      createHeaders(),
    )
    .then(() => {
      location.reload();
    });
};

const passBalance = (targetUser, amount) => {
  console.log(cookie.parse(document.cookie));
  return axios
    .post(
      '/pass-money',
      {
        targetUser,
        amount,
      },
      createHeaders(),
    )
    .then(() => {});
};

const logout = () => {
  return axios.post('/logout', {}, createHeaders()).then(() => {
    location.reload();
  });
};

ReactDOM.render(
  <App user={user} login={login} logout={logout} passBalance={passBalance} />,
  document.getElementById('root'),
);
