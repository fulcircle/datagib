import React from 'react';
import ReactDOM from 'react-dom';
import Datagib from './Datagib';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Datagib />, div);
  ReactDOM.unmountComponentAtNode(div);
});
