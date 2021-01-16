import React from 'react'
import * as Cookies from 'js-cookie'

import '../../assets/fonts/css/icons.css'
import Validator from '../../utils/Validator'
import './index.css'


class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      joinBtn: false,
      channel: '',
      name: '',
      baseMode: 'avc',
      transcode: 'interop',
      attendeeMode: 'video',
      videoProfile: '360p_4',
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', (e) => {
      e.keyCode === 13 && this.handleJoin()
    })
  }

  /**
   * 
   * @param {String} val 0-9 a-z A-Z _ only 
   * @param {Boolean} state 
   */
  handleChannel = (val, state) => {
    this.setState({
      channel: val,
      joinBtn: (this.name !== '' && val !== '')
    })
  }

   handleName = (val, state) => {
    this.setState({
      name: val,
      joinBtn: (this.channel !== '' && val !== '')
    })
  }

  handleJoin = () => {
    if (!this.state.joinBtn) {
      return
    }
    console.log(this.state)
    Cookies.set('channel', this.state.channel)
    Cookies.set('username', this.state.name)
    Cookies.set('baseMode', this.state.baseMode)
    Cookies.set('transcode', this.state.transcode)
    Cookies.set('attendeeMode', this.state.attendeeMode)
    Cookies.set('videoProfile', this.state.videoProfile)
    window.location.hash = "meeting"
  }

  render() {
    return (
      <div className="wrapper index">
        <div className="ag-header"></div>
        <div className="ag-main">
          <section className="login-wrapper">
            <div className="login-header">
              <p className="login-subtitle">Karokee Party</p>
            </div>
            <div className="login-body">
              <div className="columns">
                <div className="column is-12">
                  <InputChannel onChange={this.handleChannel} placeholder="Room ID"></InputChannel>
                  <InputChannel onChange={this.handleName} placeholder="Username (host to be host)"></InputChannel>
                </div>
              </div>
            </div>
            <div className="login-footer">
              <a id="joinBtn"
                onClick={this.handleJoin}
                disabled={!this.state.joinBtn}
                className="ag-rounded button is-info">Start
              </a>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

class InputChannel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMsg: '',
      state: ''
    }
  }

  validate = (val) => {
    this.setState({
      state: '',
      errorMsg: ''
    })
    if (Validator.isNonEmpty(val.trim())) {
      this.setState({
        errorMsg: 'Cannot be empty!',
        state: 'is-danger'
      })
      return false
    }
    else if (Validator.minLength(val.trim(), 1)) {
      this.setState({
        errorMsg: 'No shorter than 1!',
        state: 'is-danger'
      })
      return false
    }
    else if (Validator.maxLength(val.trim(), 16)) {
      this.setState({
        errorMsg: 'No longer than 16!',
        state: 'is-danger'
      })
      return false
    }
    else if (Validator.validChar(val.trim())) {
      this.setState({
        state: 'is-danger',
        errorMsg: 'Only capital or lower-case letter, number and "_" are permitted!'
      })
      return false
    }
    else {
      this.setState({
        state: 'is-success'
      })
      return true
    }
  }

  handleChange = (e) => {
    let state = this.validate(e.target.value)
    this.props.onChange(e.target.value, state)
  }

  render() {
    let validateIcon = ''
    switch (this.state.state) {
      default:
      case '':
        validateIcon = ''; break;
      case 'is-success':
        validateIcon = (<i className="ag-icon ag-icon-valid"></i>); break;
      case 'is-danger':
        validateIcon = (<i className="ag-icon ag-icon-invalid"></i>); break;
    }

    return (
      <div className="channel-wrapper control has-icons-left">
        <input onInput={this.handleChange}
          id="channel"
          className={'ag-rounded input ' + this.state.state}
          type="text"
          placeholder={this.props.placeholder} />
        <span className="icon is-small is-left">
          <img src={require('../../assets/images/ag-login.png')} alt="" />
        </span>
        <span className="validate-icon">
          {validateIcon}
        </span>
        <div className="validate-msg">
          {this.state.errorMsg}
        </div>
      </div>
    )
  }
}

export default Index