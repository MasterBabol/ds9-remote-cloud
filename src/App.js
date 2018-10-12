import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header, Footer } from 'components';
import { Home, Logistics, Signals, LocalEstates, Technology } from 'containers';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/logistics" component={Logistics} />
                        <Route path="/signals" component={Signals} />
                        <Route path="/localestates" component={LocalEstates} />
                        <Route path="/technologies" component={Technology} />
                    </Switch>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
