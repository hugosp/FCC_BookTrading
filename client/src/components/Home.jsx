import React from 'react';
import style from './Home.css';

class Home extends React.Component {

  render() {
    return (
      <div className="con">
        <h2 className="text-center"> Welcome to BookTrader Deluxe 2k16</h2>
        <img className="text-center" src="img/book.jpg" />
        <h5 className="text-center">Here u can trade books with people</h5>
      </div>
    );
  }

}

export default Home;