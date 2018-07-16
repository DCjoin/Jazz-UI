'use strict';

import React, { Component}  from "react";
import PropTypes from 'prop-types';
import ClickAway from "./ClickAwayListener.jsx";
import Paper from 'material-ui/Paper';

@ClickAway
export default class PopupPaper extends Component {
  onClickAway(){
      this.props.onRequestClose()
  }
  render(){
    if(this.props.open){
      return <Paper zDepth={1} rounded={false} style={this.props.style}>{this.props.children}</Paper>
    }else{
      return null
    }
  }
}

PopupPaper.propTypes= {
  open:PropTypes.bool,
  onRequestClose:PropTypes.func,
  style:PropTypes.object
};