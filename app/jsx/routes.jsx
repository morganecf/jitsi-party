import React from 'react'
import { Router, Route } from 'react-router'
import { createBrowserHistory } from 'history'
import Welcome from './Welcome.jsx'
import About from './About.jsx'
import Map from './Map.jsx'
import Room from './Room.jsx'

export default (
    <Router history={createBrowserHistory()}>
        <Route exact path="/" component={Welcome} />
        <Route path="/about" component={About}/>
        <Route path="/map" component={Map}/>
        <Route path="/party" component={Room}/>
    </Router>
)
