import React from 'react';
import {Link} from 'react-router';
import request from 'superagent';
import Auth from '../modules/Auth';
import style from './AddBook.css';

class AddBook extends React.Component {
  constructor() {
    super();
    this.state = {
      result: []
    };
  }
  searchBooks(e) {
    e.preventDefault();
    let self = this;
    let query = this.refs.bookName.value;
    request
      .get('/api/books/search')
      .set('x-access-token', Auth.getToken())
      .set('Accept', 'application/json')
      .query({q:query})
      .end(function(err, res){
        let state = {};
        if (res.status == 200) {
          state.result = res.body.result;
          self.setState(state);
        }
      });
  }
  addBook(i,e) {
    let self = this;
    let query = this.state.result[i];
    request
      .get('/api/books/add')
      .set('x-access-token', Auth.getToken())
      .set('Accept', 'application/json')
      .query(query)
      .end(function(err, res){
        if (res.status == 200) {
          self.props.refresh();
        }
      });
  }
  render() {
    var books = this.state.result.map((v,i) => ( <img src={v.thumbnail} key={v.id} className={style.books} onClick={this.addBook.bind(this,i)}/> )) 
    return (
      <div>
        <form>
          <input type="text" ref="bookName" />
          <button onClick={this.searchBooks.bind(this)}>Search for Books to add to Collection</button>
        </form>
        {books}
      </div>
    );
  }

}

export default AddBook;