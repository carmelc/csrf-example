# CSRF Attack example

1. Run the legit app
```rm -rf node_modules && npm i && npm start```
2. Open [http://localhost:3000/app] (or http://*your-macine-name*:3000/app), singup and see the balance
3. Go to [https://plnkr.co/edit/Vo8wUmFueGYZH3RyUr93]
  -  If you are using remote machine, fork it and change localhost in the form action to your machine name
4. Switch back to the legit user session and click the "check" button
5. Note that 1000 were transferred to the hacker account:
  - Refresh the app and see that 1000 were deducted
  - Login to the hacker account (user: *hacker@gmail.com*, pass: *11111*) from incognito (or another machine) and see that it has 1000 more

# Solving it
1. In ```client.tsx``` uncomment ```[XSRF_HEADER_NAME]: cookie.parse(document.cookie)['XSRF-TOKEN']```
2. In ```server.js``` uncomment the call to ```if(validateCsrf(req, res)) {```
<br>-- OR --<br>
1. Add "*sameSite: 'Strict'*" to the cookie *SESSIONID* definition (uncomment it in ```server.js```).

[Git Link](https://github.com/carmelc/csrf-example)