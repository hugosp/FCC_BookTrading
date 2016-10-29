import React             from 'react';
import {Link, IndexLink} from 'react-router';
import Auth              from '../modules/Auth';
import style             from './Base.css';
class Base extends React.Component {
  render() {
    return (
      <div className={style.container}>  
        <header>
          <div className={style.title}>BookTradingClub</div>
          <div className={style.nav}>
            <ul>
              <li><IndexLink to="/">Home</IndexLink></li>
              {Auth.isUserAuthenticated() &&  <li><Link to="/profile">Profile</Link></li> }
              {Auth.isUserAuthenticated() &&  <li><Link to="/all">All Books</Link></li> }
              {Auth.isUserAuthenticated() &&  <li><Link to="/logout">Log out</Link></li> }
              {!Auth.isUserAuthenticated() && <li><Link to="/login">Log in</Link></li> }
              {!Auth.isUserAuthenticated() && <li><Link to="/signup">Sign up</Link></li> }
              </ul>
            </div>
        </header>
        <div>
          {this.props.children}
        </div>
      
      </div>
    );
  }
}

export default Base;