const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const renderVM = require('./vm');
const uuidv1 = require('uuid/v1');

var bodyParser = require('body-parser');

const app = express();

export const XSRF_HEADER_NAME = 'X-XSRF-TOKEN';
export const XSRF_COOKIE_NAME = 'XSRF-TOKEN';

const users = [
  {username: 'good-user@gmail.com', sessionCookie: null, password: '12345', balance: 30000},
  {username: 'hacker@gmail.com', sessionCookie: null, password: '11111', balance: 30000},
  {username: 'gbt@gmail.com', sessionCookie: null, password: '111', balance: 30000},
];

// Register an express middleware. Learn more: http://expressjs.com/en/guide/using-middleware.html.
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

function getUserBySession(req) {
  let user = null;
  if (req.cookies.SESSIONID) {
    user = users.find(usr => usr.sessionCookie === req.cookies.SESSIONID);
  }
  return user;
}

function getUserByLogin(req) {
  const username = req.body.username;
  const password = req.body.password;
  return users.find(usr => usr.username === username && usr.password === password);
}

function doLoginForUser(user, res) {
  const sessionId = uuidv1();
  user.sessionCookie = sessionId;
  res.cookie('SESSIONID', sessionId, {maxAge: 900000, httpOnly: true});
}

function validateCsrf(req, res) {
  const csrfFromCookie = req.cookies[XSRF_COOKIE_NAME];
  const csrfFromHeader = req.header(XSRF_HEADER_NAME);
  if (csrfFromCookie !== csrfFromHeader) {
    res.status(401);
    res.send('CSRF attempt');
    return false;
  }
  return true;
}

app.post('/login', (req, res) => {
  const user = getUserByLogin(req);
  if (user) {
    doLoginForUser(user, res);
    res.status(200);
    res.send('Logged in');
  } else {
    res.status(401);
    res.send('Login failed');
  }
});

app.post('/signup', (req, res) => {
  const user = {
    username: req.body.username,
    pass: req.body.password,
    balance: 30000,
    sessionCookie: null,
  };
  users.push(user);
  doLoginForUser(user, res);
  res.status(200);
  res.send('Signed Up');
});

app.post('/logout', (req, res) => {
  const user = getUserBySession(req);
  if (user) {
    user.sessionCookie = null;
  }
  res.send('Logged out');
});

app.post('/pass-money', (req, res) => {
  // if(validateCsrf(req, res)) {
    const user = getUserBySession(req);
    if (user) {
      const amount = Number(req.body.amount);
      const targetUsername = req.body.targetUser;
      const targetUser = users.find(usr => usr.username === targetUsername);
      if (targetUser && amount > 0) {
        user.balance-=amount;
        targetUser.balance+=amount;
      }
      res.status(200);
      res.send('Passed');
    } else {
      res.status(401);
      res.send('Not logged in');
    }
  // }
});

// Define a route to render our initial HTML.
app.use('/app', (req, res) => {
  const user = getUserBySession(req);
  const injectedUser = user ? {
    username: user.username,
    balance: user.balance,
  } : null;

  const html = renderVM({
    user: JSON.stringify(injectedUser),
  });

  res.cookie(XSRF_COOKIE_NAME, uuidv1(), {
    maxAge: 900000,
    httpOnly: false,
    // sameSite: 'Strict', //new attribute, removes the need for the header
  });

  res.send(html);
});

// Launch the server
app.listen(process.env.PORT, () => {
  console.info(`Fake server is running on port ${process.env.PORT}`);
});
