'use strict';

import React from 'react';
import { TextField, CircularProgress } from 'material-ui';
import Immutable from 'immutable';
import MailStore from '../../stores/MailStore.jsx';
import ReceiverItem from './MailReceiverItem.jsx';

let MailField = React.createClass({
  _onMailViewChanged: function() {
    this.setState({
      receivers: MailStore.getReceivers()
    });
  },
  componentDidMount: function() {
    MailStore.addMailViewListener(this._onMailViewChanged);
  },
  componentWillUnmount: function() {
    MailStore.removeMailViewListener(this._onMailViewChanged);
  },
  getInitialState: function() {
    return {
      receivers: Immutable.List([])
    };
  },
  render: function() {
    // var recieverStyle = {
    //   border: '1px solid #ececec',
    //   backgroundColor: '#ffffff',
    //   width: '600px'
    // };
    var receiverField = [];
    if (this.state.receivers.size > 0) {
      this.state.receivers.forEach(receiver => {
        receiverField.push(<ReceiverItem nodeData={receiver}/>);
      })
    }

    return (
      <div className='jazz-mailfield'>
        <div className='jazz-mailfield-reciever'>
          <div className='recievertitle'>
            {I18N.Mail.Reciever}
          </div>
          <div className='recievercontent'>
            {receiverField}
          </div>
        </div>
        <div className='jazz-mailfield-template'>
          <div className='templatetitle'>
            {I18N.Mail.Template}
          </div>
        </div>
        </div>
      );
  },
});
module.exports = MailField;
