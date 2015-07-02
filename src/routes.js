import React from 'react';
import {Route} from 'react-router';

import Main from 'components/main';
import Example from 'components/example';

const routes = (
  <Route handler={Main}>
    <Route name='example' handler={Example}/>
  </Route>
);

export default routes;
