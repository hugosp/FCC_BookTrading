import React from 'react';
import {Link} from 'react-router';
import request from 'superagent';
import Auth from '../modules/Auth';
import AddBook from './AddBook.jsx';
import MyBooks from './MyBooks.jsx';
import style from './Profile.css';

class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      user: {},
      result: []
    };
  }
  componentWillMount() {
    this.getUser();
    this.getBooks();
  }
  getUser() {
    let self = this;
    request
      .get('/api/profile')
      .set('x-access-token', Auth.getToken())
      .set('Accept', 'application/json')
      .end(function(err, res){
        let state = {};
        if (res.status == 200) {
          state.user = res.body;
          self.setState(state);
        }
      });
  }
  getBooks() {
    let self = this;
    request
      .get('/api/books/my')
      .set('x-access-token', Auth.getToken())
      .set('Accept', 'application/json')
      .end(function(err, res){
        let state = {};
        console.log(res);
        if (res.status == 200) {
          state.books = res.body.books;
          self.setState(state);
        }
      });
  }
  render() {
    return (
      <div>
        <h5>User Details</h5>
        <code>Name : {this.state.user.user}</code><br />
        <code>Email : {this.state.user.email}</code>
        <MyBooks showDelete={true} refresh={this.getBooks.bind(this)} books={this.state.books}/>

        <AddBook refresh={this.getBooks.bind(this)}/>

      </div>
    );
  }

}

export default Profile;