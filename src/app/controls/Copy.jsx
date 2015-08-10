'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {Dialog,FlatButton} from 'material-ui';

var Copy = React.createClass({

  render:function(){
    let customActions = [
    <FlatButton
    label="Cancel"
    secondary={true}
    onTouchTap={this._handleCustomDialogCancel} />,
  <FlatButton
    label="Submit"
    primary={true}
    onTouchTap={this._handleCustomDialogSubmit} />
];
    return(
      <Dialog
        title="Dialog With Custom Actions"
        actions={customActions}>
        The actions in this window were passed in as an array of react objects.
      </Dialog>
    )
  }

});

module.exports = Copy;
