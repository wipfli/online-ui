import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom'

import App from './App'
import Home from './Home'

export default function Main() {
    return (
        <Router>
            <Switch>
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
