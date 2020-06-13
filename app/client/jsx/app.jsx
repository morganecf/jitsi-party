import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import routes from './routes.jsx'
import reducers from './reducers.jsx'
import '../styles/main.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// Allow arbitrary icons to be used without importing them
library.add(fas)

const provider = <Provider store={createStore(reducers.reducer)}> {routes} </Provider>
ReactDOM.render(provider, document.querySelector('.app'))
