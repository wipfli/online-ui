import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

import App from './App'
import Home from './Home'
import LiveMap from './LiveMap'

export default function Main() {
    return (
        <Router>
            <Switch>
                <Route path="/map">
                    <LiveMap />
                </Route>
                <Route path="/:username/:flightId">
                    <App />
                </Route>
                <Route path="/:username">
                    <App />
                </Route>
                <Route path="/">
                    <Home />
                </Route>
            </Switch>
        </Router>
    )
}
