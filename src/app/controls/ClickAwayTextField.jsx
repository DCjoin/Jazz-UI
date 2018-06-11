'use strict';

import React,{ Component } from 'react';
import {TextField} from 'material-ui';
import ClickAway from './ClickAwayListener.jsx';
import PropTypes from 'prop-types';
@ClickAway
export default class ClickAwayTextField extends Component {

  onClickAway() {
    if(this.props.onClickAway) this.props.onClickAway()
  }

  render(){
    return(
      <TextField {...this.props}/>
    )
  }
}

ClickAwayTextField.propTypes={
  onClickAway:PropTypes.func
}
