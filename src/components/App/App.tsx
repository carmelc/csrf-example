import * as React from 'react';
import * as s from './App.scss';

export interface User {
  username: string;
  balance: number;
}

interface AppProps {
  user: User;
  passBalance(targetUser, amountToPass): Promise<any>;
  login(user, password, isNew: boolean): Promise<any>;
  logout(): Promise<any>;
}

interface AppState {
  username: string;
  password: string;
  targetUser: string;
  balanceToPass: string;
}

class App extends React.Component<AppProps, AppState> {
  clickedButton: 'login' | 'new' = 'login';

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      targetUser: '',
      balanceToPass: '',
    };
  }
  handleSubmit() {
    return this.props.passBalance(
      this.state.targetUser,
      this.state.balanceToPass,
    );
  }

  handleLogout() {
    return this.props.logout();
  }

  handleLogin() {
    return this.props.login(
      this.state.username,
      this.state.password,
      this.clickedButton === 'new',
    );
  }

  handleChangeTargetUser(event) {
    this.setState({ targetUser: event.target.value });
  }

  handleChangeBalanceToPass(event) {
    this.setState({ balanceToPass: event.target.value });
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { user } = this.props;
    return user ? (
      <div className={s.root}>
        <input
          type="button"
          value="logout"
          className={`${s.logout} btn btn-secondary`}
          onClick={() => this.handleLogout()}
        />
        <h3 className={s.title} data-testid="app-title">
          {`Hi ${user.username}`}
        </h3>
        <h3>{`Your balance is: $${user.balance}`}</h3>
        <form onSubmit={() => this.handleSubmit()}>
          <div className={'form-group'}>
            <label htmlFor="balance-to-pass">User to Pass Balance to:</label>
            <input
              className="form-control"
              id="balance-to-pass"
              type="text"
              value={this.state.targetUser}
              onChange={ev => this.handleChangeTargetUser(ev)}
              required={true}
            />
            <label htmlFor="amount-to-pass">Amount to pass ($):</label>
            <input
              className="form-control"
              id="amount-to-pass"
              type="text"
              value={this.state.balanceToPass}
              onChange={ev => this.handleChangeBalanceToPass(ev)}
              required={true}
            />
          </div>
          <input type="submit" value="Submit" className="btn btn-primary" />
        </form>
      </div>
    ) : (
      <div className={s.root}>
        <h2>{`Welcome to the currency app, please login`}</h2>
        <form onSubmit={() => this.handleLogin()}>
          <div className={'form-group'}>
            <label htmlFor="username">Username:</label>
            <input
              className="form-control"
              id="username"
              type="text"
              value={this.state.username}
              onChange={ev => this.handleChangeUsername(ev)}
              required={true}
            />
            <label htmlFor="password">Password:</label>
            <input
              className="form-control"
              id="password"
              type="password"
              value={this.state.password}
              onChange={ev => this.handleChangePassword(ev)}
              required={true}
            />
          </div>
          <input
            type="submit"
            value="login"
            className="btn btn-primary"
            onClick={() => {
              this.clickedButton = 'login';
              return true;
            }}
          />
          <h4>{'Not a member already, you can signup'}</h4>
          <input
            type="submit"
            value="signup"
            className="btn btn-light"
            onClick={() => {
              this.clickedButton = 'new';
              return true;
            }}
          />
        </form>
      </div>
    );
  }
}

export default App;
