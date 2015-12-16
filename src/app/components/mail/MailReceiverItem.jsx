'use strict';

import React from 'react';
import { FlatButton, CircularProgress, Tabs, Tab, FontIcon } from 'material-ui';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';

let MailReceiverItem = React.createClass({
  propTypes: {
    nodeData: React.PropTypes.object,
  },
  _onCleanButtonClick: function() {
    MailAction.removeReceiver(this.props.nodeData);
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    return nextProps.nodeData.get('Id') !== this.props.nodeData.get('Id');
  },
  render: function() {
    var cleanIconStyle = {
      marginLeft: '10px',
      marginRight: '7.5px',
      fontSize: '16px',
    };
    return (
      <div className='jazz-mailfield-recieveritem'>
          <div className='node-content-text' style={{
        marginLeft: '7.5px'
      }}>
            {this.props.nodeData.get('Name')}
          </div>
          <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
        </div>

      )
  }
});
module.exports = MailReceiverItem;
