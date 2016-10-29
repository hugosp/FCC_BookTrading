import React from 'react';
import request from 'superagent';
import Auth from '../modules/Auth';
import style from './MyBooks.css';

class MyBooks extends React.Component {
  delete(i,e) {
    let self = this;
    let query = {id:this.props.books[i]._id};
    request
      .get('/api/books/delete')
      .set('x-access-token', Auth.getToken())
      .set('Accept', 'application/json')
      .query(query)
      .end(function(err, res){
        if (res.status == 200) {
          console.log(res);
          self.props.refresh();
        }
      });
  }
  render() {
    return (
      <div>
        {this.props.books && this.props.books.map((v,i) => ( 
          <div ref="bookDiv" className={style.bookDiv} key={i}>
            {this.props.showDelete && <div className={style.delete} onClick={this.delete.bind(this,i)}>DELETE</div> }
            <img src={v.thumbnail} key={i} className={style.bookImg} />
          </div>
        ))}
        <div className="clear"></div>
      </div>
    );
  }

}

export default MyBooks;