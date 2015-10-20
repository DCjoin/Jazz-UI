'use strict';

import React from 'react';
import { TextField, CircularProgress, Checkbox } from 'material-ui';
import Immutable from 'immutable';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';
import ReceiverItem from './MailReceiverItem.jsx';
import TemplateField from './MailTemplateField.jsx';
import SaveNewTemplate from './MailSaveNewTemplate.jsx';

let MailField = React.createClass({
  _onMailViewChanged: function() {
    var mailView = MailStore.getMailView();
    this.setState({
      receivers: mailView.receivers,
      template: mailView.template,
      subject: mailView.subject,
      content: mailView.content
    });
  },
  _onSubjectChanged: function(e) {
    this.setState({
      subject: e.target.value
    });
  },
  _onSubjectBlur: function(e) {
    MailAction.setSubject(e.target.value);
  },
  _onContentChanged: function(e) {
    this.setState({
      content: e.target.value
    });
  },
  _onContentBlur: function(e) {
    MailAction.setContent(e.target.value);
  },
  _onMessageCheck: function() {
    var checked = this.refs.checkbox.isChecked();
    MailAction.setMsgNotice(checked);
  },
  componentDidMount: function() {
    MailStore.addMailViewListener(this._onMailViewChanged);
  },
  componentWillUnmount: function() {
    MailStore.removeMailViewListener(this._onMailViewChanged);
  },
  getInitialState: function() {
    return {
      receivers: Immutable.List([]),
      template: null,
      subject: null,
      content: null
    };
  },
  render: function() {
    var subjectStyle = {
        border: '1px solid #ececec',
        backgroundColor: '#ffffff',
        width: '600px',
        fontSize: '14px',
        height: '30px',
        padding: '0 10px'
      },
      underlineStyle = {
        borderBottom: '1px solid transparent',
      },
      underlineFocusStyle = {
        borderColor: 'transparent'
      },
      boxStyle = {
        width: '189px'
      },
      iconStyle = {
        width: '24px',
        marginRight: '10px'
      },
      labelStyle = {
        fontSize: '14px',
        color: '#464949',
        width: '155px'
      };
    var subjectProps = {
        style: subjectStyle,
        underlineStyle: underlineStyle,
        underlineFocusStyle: underlineFocusStyle,
        value: this.state.subject,
        onChange: this._onSubjectChanged,
        onBlur: this._onSubjectBlur
      },
      contentProps = {
        underlineStyle: underlineStyle,
        underlineFocusStyle: underlineFocusStyle,
        value: this.state.content,
        onChange: this._onContentChanged,
        onBlur: this._onContentBlur,
        multiLine: true,
        fullWidth: true
      };
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
          <TemplateField template={this.state.template}/>
        </div>
        <div className='jazz-mailfield-subject'>
          <div className='subjecttitle'>
            {I18N.Mail.Subject}
          </div>
          <TextField {...subjectProps}/>
        </div>
        <div className='jazz-mailfield-content'>
          <div className='contenttitle'>
            {I18N.Mail.Content}
          </div>
          <div className='contentcontent'>
            <TextField {...contentProps}/>
          </div>
        </div>
        <div className='jazz-mailfield-newTemplate'>
          <SaveNewTemplate/>
        </div>
        <div className='jazz-mailfield-newTemplate'>
          <Checkbox
      ref='checkbox'
      style={boxStyle}
      iconStyle={iconStyle}
      labelStyle={labelStyle}
      label={I18N.Mail.Message}
      onCheck={this._onMessageCheck}/>
        </div>
        </div>
      );
  },
});
module.exports = MailField;
