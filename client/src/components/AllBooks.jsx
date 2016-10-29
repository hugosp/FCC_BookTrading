import React from 'react';
import request from 'superagent';
import Auth from '../modules/Auth';
import MyBooks from './MyBooks.jsx';
import style from './AllBooks.css';

class AllBooks extends React.Component {
  constructor() {
    super();
    this.state = {
      books: []
    };
  }
  componentWillMount() {
    this.getBooks();
  }
  getBooks() {
    let self = this;
    request
      .get('/api/books/all')
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
        <h5>All Books</h5>
        <MyBooks refresh={this.getBooks.bind(this)} books={this.state.books}/>
      </div>
    );
  }

}

export default AllBooks;