import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header } from 'components';
import { Home, Logistics, Signals, LocalEstates } from 'containers';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <div>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/logistics" component={Logistics} />
                        <Route path="/signals" component={Signals} />
                        <Route path="/localestates" component={LocalEstates} />
                    </Switch>
                </div>
            </div>
        </Router>
    );
};

export default App;
