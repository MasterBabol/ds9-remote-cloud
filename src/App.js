import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header } from 'components';
import { Home, Logistics, LocalEstates } from 'containers';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/logistics" component={Logistics} />
                        <Route path="/localestates" component={LocalEstates} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
};

export default App;
