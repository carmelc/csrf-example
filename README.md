# CSRF Attack example

1. Run the legit app
```rm -rf node_modules && npm i && npm start```
2. **If you plan to run the server from remote machine** (not only localhost) do this before ```npm start```
  -  Replace localhost with your machine name (or localhost if you only plan to run on one machine) in dev/velocity.data.json (staticsBaseUrl).
  -  Go to ```./node_modules/yoshi/src/webpack-utils.js``` and add ```disableHostCheck: true,``` in the WebpackDevServer options object.
3. Open http://localhost:3000/app (or http://your-macine-name:3000/app), singup and see the balance
4. Go to https://plnkr.co/edit/Vo8wUmFueGYZH3RyUr93
  -  If you are using remote machine, fork it and change localhost in the form action to your machine name
5. Click the "check" button
6. Note that 1000 were transferred to the hacker account.

# Solving it
1. In ```client.tsx``` uncomment ```[XSRF_HEADER_NAME]: cookie.parse(document.cookie)['XSRF-TOKEN']```
2. In ```server.js``` uncomment the call to ```if(validateCsrf(req, res)) {```
  
