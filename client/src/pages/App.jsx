import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import 'bulma/css/bulma.css'

import './App.css'
import Index from './index'
import Meeting from './meeting'
import SongViewer from './SongViewer'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="full">
          <Route exact path="/" component={Index} />
          <Route path="/meeting" component={Meeting} />
          <Route path="/lrc" component={SongViewer} />
        </div>
      </Router>
    )
  }
}

export default App
