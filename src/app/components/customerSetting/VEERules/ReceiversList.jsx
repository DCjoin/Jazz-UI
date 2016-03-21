'use strict';

import React from 'react';

//import Dialog from '../../../controls/PopupDialog.jsx';
import FlatButton from '../../../controls/FlatButton.jsx';
import SectionPanel from '../../../controls/SectionPanel.jsx';
import { formStatus } from '../../../constants/FormStatus.jsx';
import { dataStatus } from '../../../constants/DataStatus.jsx';
import Immutable from 'immutable';
import CurrentUserStore from '../../../stores/CurrentUserStore.jsx';
import { Dialog, CircularProgress, Checkbox } from 'material-ui';
import VEEStore from '../../../stores/customerSetting/VEEStore.jsx';
import VEEAction from '../../../actions/customerSetting/VEEAction.jsx';
import { List } from 'immutable';
function emptyList() {
  return new List();
}
// let {
//   FlatButton
// } = mui;
var ReceiversList = React.createClass({
  propTypes: {
    status: React.PropTypes.string,
    receivers: React.PropTypes.array,
    ruleId: React.PropTypes.number,
    dataDidChanged: React.PropTypes.func
  },

  getInitialState: function() {
    var state = Immutable.fromJS({
      showDialog: false,
    });
    return {
      state
    }; //for some reason, can't return an immutable object
  },

  shouldComponentUpdate: function(nextProps, nextState) {

    if (this.props.status === nextProps.status && this.props.receivers === nextProps.receivers && this.state.state === nextState) {
      return false;
    }
    return true;
  },

  _handleClickAddReceivers: function(event) {

    this._showDialog();

  },
  _notifyDataChanged(type, receivers, index) {
    this.props.dataDidChanged(type, receivers, index);
  },
  _didChanged(receivers) {
    this._notifyDataChanged(dataStatus.UPDATED, receivers);
  },
  _deleteReceiver(receiver, index) {
    this._notifyDataChanged(dataStatus.DELETED, receiver, index);

  },
  _showDialog(receivers, inAdd, index) {
    var state = Immutable.fromJS({
      showDialog: true,
    });
    this.setState({
      state
    }, () => {
      if (this.refs.receiversDialog) {
        this.refs.receiversDialog.show();
      }
    });
  },
  _onDialogDismiss: function() {
    var state = Immutable.fromJS({
      showDialog: false,
    });
    this.setState({
      state
    });
  },


  render: function() {
    var receiversData = this.props.receivers || emptyList();
    var status = this.props.status;
    var receivers = receiversData.map((item, index) => {
      return (
        <Receiver lang={window.currentLanguage} receiver={item} deleteReceiver={this._deleteReceiver} index={index} key={"receivers-index-" + index} status={status}/>
        );
    });

    var sectionPanelProps = {
      title: I18N.Setting.VEEMonitorRule.Receivers,
      hasAction: status !== formStatus.VIEW,
      onAction: this._handleClickAddReceivers,
      actionLabel: I18N.Common.Button.Add
    };
    var dialog = null;
    var state = this.state.state;
    if (state.get('showDialog')) {
      var dialogProp = {
        ref: "receiversDialog",
        didChanged: this._didChanged,
        receivers: receiversData,
        ruleId: this.props.ruleId,
        onDismiss: this._onDialogDismiss,
      };
      dialog = (
        <ReceiversDialog {...dialogProp}/>
      );
    }

    return (
      <SectionPanel className="pop-admins" {...sectionPanelProps}>
        {receiversData.size > 0 ? (
        <div className="pop-admin-container" style={{
          marginTop: '25px'
        }}>
              {receivers}
            </div>
        ) : null}
          {dialog}
      </SectionPanel>
      );
  }
});

var Receiver = React.createClass({
  propTypes: {
    status: React.PropTypes.string,
    receiver: React.PropTypes.object,
    index: React.PropTypes.number,
    deleteReceiver: React.PropTypes.func,
    lang: React.PropTypes.string,
  },

  shouldComponentUpdate: function(nextProps, nextState) {

    if (this.props.status === nextProps.status && this.props.receiver === nextProps.receiver && this.props.lang === nextProps.lang) {
      return false;
    }
    return true;
  },

  _handleDeleteReceiver: function(event) {
    this.props.deleteReceiver(this.props.receiver, this.props.index);
  },



  render: function() {
    var deleteBtn = null;
    var titleList = CurrentUserStore.getUserTitle();
    if (this.props.status !== formStatus.VIEW) {
      deleteBtn = (
        <div className="pop-admin-btn">
          <a onClick={this._handleDeleteReceiver}>{I18N.Common.Button.Delete}</a>
        </div>
      );
    }

    return (
      <div className="pop-admin">
        <ul>
          <li>
            <span className="pop-admin-name" title={this.props.receiver.get('RealName')}>{this.props.receiver.get('RealName')}</span>
          </li>
          <li>
            <span className="pop-admin-other" title={titleList[this.props.receiver.get('Title')]}>{titleList[this.props.receiver.get('Title')]}</span>
          </li>
        </ul>
        {deleteBtn}
      </div>
      );
  }
});

var ReceiversDialog = React.createClass({
  propTypes: {
    didChanged: React.PropTypes.func,
    receivers: React.PropTypes.object,
    ruleId: React.PropTypes.number,
    onDismiss: React.PropTypes.func,
  },
  getInitialState: function() {
    return ({
      allReceivers: VEEStore.getAllReceivers(),
      receivers: this.props.receivers,
      isLoading: true
    })
  },
  show: function() {
    this.refs.dialog.show();
  },
  _onAllReceiversChanged: function() {
    this.setState({
      allReceivers: VEEStore.getAllReceivers(),
      isLoading: false
    })
  },
  _onFirstActionTouchTap: function() {
    this.props.didChanged(this.state.receivers.toJS());
    this.props.onDismiss();
  },
  _onSecondActionTouchTap: function() {
    this.refs.dialog.dismiss();
    this.props.onDismiss();
  },
  mergeReceive: function(receiver, isAll, status) {
    var receivers = emptyList();
    if (isAll) {
      if (status) {
        receivers = this.state.allReceivers
      }
    } else {
      receivers = this.state.receivers;
      if (status) {
        receivers = receivers.unshift(receiver)
      } else {
        receivers = receivers.delete(receivers.findIndex(item => item.get('UserId') == receiver.get('UserId')));
      }
    }
    this.setState({
      receivers: receivers
    })
  },
  componentDidMount: function() {
    VEEStore.addReceiversChangeListener(this._onAllReceiversChanged);
    VEEAction.getAllReceivers(this.props.ruleId);
  },
  componentWillUnmount: function() {
    VEEStore.removeReceiversChangeListener(this._onAllReceiversChanged);
  },
  _renderReceiverItem: function(reciever, status) {
    var that = this;
    var titleList = CurrentUserStore.getUserTitle();
    var boxStyle = {
        marginLeft: '20px',
        width: '24px'
      },
      iconstyle = {
        width: '24px'
      },
      labelstyle = {
        width: '0px',
        height: '0px'
      };
    var _onItemClick = function() {
      that.mergeReceive(reciever, false, !status)
    };
    return (
      <div className='jazz-folder-alluser-useritem' onClick={_onItemClick}>
    <Checkbox
      checked={status}
      style={boxStyle}
      iconStyle={iconstyle}
      labelStyle={labelstyle}
      />
    <div className='name' title={reciever.get('RealName')}>
        {reciever.get('RealName')}
      </div>
      <div className='type' title={titleList[reciever.get('Title')]}>
        {titleList[reciever.get('Title')]}
      </div>
  </div>
      )
  },
  _renderReceivers: function() {
    var content = [];
    var that = this;
    var allCheckStyle = {
        marginLeft: '20px',
        width: '36px',
      },
      labelstyle = {
        width: '0px',
        height: '0px'
      },
      fontStyle = {
        fontSize: '14px',
        color: '#abafae'
      };
    var _onAllCheck = function(event, checked) {
      that.mergeReceive(null, true, checked)
    };
    var checkAllCheck = function() {
      var receivers = that.state.receivers || [],
        allReceivers = that.state.allReceivers;

      return (receivers.size === allReceivers.size)
    };
    this.state.allReceivers.forEach(function(user) {
      let status = (that.state.receivers.findIndex(item => item.get('UserId') == user.get('UserId')) >= 0);
      content.push(that._renderReceiverItem(user, status));
    })
    return (
      <div>
    <div className='jazz-folder-allusers'>
      <div className='allcheck'>
        <Checkbox
      onCheck={_onAllCheck}
      ref="checkall"
      style={allCheckStyle}
      labelStyle={labelstyle}
      checked={checkAllCheck()}
      />
        <div style={fontStyle} className='name'>
          {I18N.Template.User.Name}
        </div>
        <div style={{
        'font-size': '14px',
        color: '#abafae',
        'margin-left': '10px'
      }} className='positon'>
          {I18N.Template.User.Position}
        </div>
      </div>
      <div className='content'>
          {content}
      </div>
    </div>

  </div>

      )
  },
  render: function() {
    //style
    let titleStyle = {
      fontSize: '20px',
      color: '#464949',
      marginLeft: '26px'
    };

    let actions = [
      <FlatButton
      label={I18N.Platform.Password.Confirm}
      onTouchTap={this._onFirstActionTouchTap}
      />,
      <FlatButton
      label={I18N.Common.Button.Cancel}
      onTouchTap={this._onSecondActionTouchTap}
      />
    ];
    let dialogProps = {
      ref: 'dialog',
      title: I18N.Setting.VEEMonitorRule.AddReceivers,
      actions: actions,
      modal: true,
      openImmediately: true,
      onDismiss: this.props.onDismiss,
      titleStyle: titleStyle
    };
    let content;
    if (this.state.isLoading) {
      content = <CircularProgress  mode="indeterminate" size={1} />
    } else {
      content = (this.state.allReceivers.size > 0) ? this._renderReceivers() : null;
    }
    return (
      <div className='jazz-copytemplate-dialog'>
        <div className='able'>
          <Dialog {...dialogProps}>
            {content}
          </Dialog>
        </div>
      </div>
      )
  }
});

module.exports = ReceiversList;
