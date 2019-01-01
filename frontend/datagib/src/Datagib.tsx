import React, { Component } from 'react';
export var nlp = require('compromise');
import './Datagib.css';

class Datagib extends Component {
  componentDidMount(): void {
  }

  render() {
    return (
      <div className="DatagibApp">
        {nlp('all commits with message containing hello').nouns().out('txt')}
      </div>
    );
  }
}

export default Datagib;
