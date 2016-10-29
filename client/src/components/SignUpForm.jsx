import React from 'react';
import {Link, browserHistory} from 'react-router';
import request from 'superagent';
import style from './SignUpForm.css';

class SignUpForm extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: '',
    };
  }
  processForm(event) {
    event.preventDefault();
    let self = this;

    let user = 'name=' + encodeURIComponent(this.refs.name.value)
             + '&email=' + encodeURIComponent(this.refs.email.value)
             + '&password=' + encodeURIComponent(this.refs.password.value);

    request
      .post('/api/signup')
      .type('form')
      .send(user)
      .end(function(err, res){
        let state = {};
        if (res.status == 200) {
          state.errorMessage = '';
          self.setState(state);
          localStorage.setItem('successMessage', res.body.message);
          browserHistory.push('/login');
        } else {
          state.errorMessage = res.body.message;
          self.setState(state);
        }
      });
  }

  render() {
    return ( 
      <div>
        <form action="/" onSubmit={this.processForm.bind(this)}>
          <h2>Sign Up</h2>

          {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>}
          
          <input type="text" ref="name" placeholder="Name"/>
          <input type="text" ref="email" placeholder="Email"/>
          <input type="password" ref="password" placeholder="Password"/>
          <button type="submit"> Create New Account </button>

          <h5>Already have an account? <Link to={'/login'}>Log in</Link></h5>
        </form>
      </div>
    );
  }

}

export default SignUpForm;