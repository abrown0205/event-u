import React from 'react';

import Home from '../components/Home';
import LoggedInName from '../components/LoggedInName';

const HomePage = () =>
{

    return(
      <div>
        <LoggedInName />
        <Home />
      </div>
    );
};

export default HomePage;
