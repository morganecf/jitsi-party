import React from 'react'
import { Router, Route } from 'react-router'
import { createBrowserHistory } from 'history'
import Welcome from './Welcome.jsx'
import Room from './Room.jsx'
import Exit from './Exit.jsx'

export default (
    <Router history={createBrowserHistory()}>
        <Route exact path="/" component={Welcome} />
        <Route path="/party" component={Room}/>
        <Route path="/bye" component={Exit}/>
    </Router>
)
