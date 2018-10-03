import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Home from './Home';
import Logistics from './Logistics';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/logistics" component={Logistics} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
};

export default App;
