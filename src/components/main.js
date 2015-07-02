/**
 * Copyright (C) MYOB - 2015
 */

import React from 'react';
import {RouteHandler, Link} from 'react-router';

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>Example</h1>
        <Link to='example'>Go to the Example page...</Link>
        <RouteHandler/>
      </div>
    );
  }
}

export default Main;
