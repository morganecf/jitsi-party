import React from 'react'
import { Router, Route } from 'react-router'
import { createBrowserHistory } from 'history'
import Vestibule from './Vestibule.jsx'
import About from './About.jsx'
import Map from './Map.jsx'

export default (
    <Router history={createBrowserHistory()}>
        <Route exact path="/" component={Vestibule} />
        <Route path="/about" component={About}/>
        <Route path="/map" component={Map}/>
    </Router>
)
