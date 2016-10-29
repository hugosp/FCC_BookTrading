import React from 'react';
import {browserHistory, Link} from 'react-router';
import request from 'superagent';
import Auth from '../modules/Auth';
import style from './LoginForm.css';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
    };
  }
  processForm(event) {
    event.preventDefault();

    let self = this;
    let user = 'email=' + encodeURIComponent(this.refs.email.value)
             + '&password=' + encodeURIComponent(this.refs.password.value);

    request
      .post('/api/authenticate')
      .type('form')
      .send(user)
      .end(function(err, res){
        let state = {};
        if (res.status == 200) {
          state.errorMessage = '';
          self.setState(state);
          Auth.authenticateUser(res.body.token);
          browserHistory.push('/');
        } else {
          state.errorMessage = res.body.message;
          self.setState(state);
        }
      });
    localStorage.removeItem('successMessage');
  }
  render() {
    const success = localStorage.getItem('successMessage');
    return (
      <div>
        <form action="/" onSubmit={this.processForm.bind(this)}>
          <h2>Login</h2>

          {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>}
          { success && <p className="success-message">{success}</p>}
          <input type="text" ref="email" placeholder="Email"/>
          <input type="password" ref="password" placeholder="Password"/>
          <button type="submit">Log in</button>

          <h5>Don't have an account? <Link to={'/signup'}>Create one</Link></h5>
        </form>
      </div>
    );
  }

}

export default LoginForm;