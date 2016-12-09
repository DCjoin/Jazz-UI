'use strict';

import React,{ Component } from 'react';
import {TextField} from 'material-ui';
import ClickAway from './ClickAwayListener.jsx';

@ClickAway
export default class ClickAwayTextField extends Component {

  onClickAway() {
    this.props.onClickAway()
  }

  render(){
    return(
      <TextField {...this.props}/>
    )
  }
}

ClickAwayTextField.propTypes={
  onClickAway:React.PropTypes.func
}
