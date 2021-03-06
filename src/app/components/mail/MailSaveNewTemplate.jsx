'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox, TextField } from 'material-ui';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';
var createReactClass = require('create-react-class');
let MailSaveNewTemplate = createReactClass({
  propTypes: {
    errorText: PropTypes.string,
  },
  _onCheck: function() {
    var checked = this.refs.checkbox.isChecked();
    this.setState({
      show: checked,
      text: null
    });

    MailAction.setNewTemplate(checked, null);
  },
  _onTextChanged: function(e) {
    MailAction.setNewTemplate(this.state.show, e.target.value);
    this.setState({
      text: e.target.value
    });
    var sendError = MailStore.GetSendError();
    if (sendError.newtemplate !== null) {
      sendError.newtemplate = null;
      MailAction.setSendError(sendError);
    }

  },
  // _onTextBlur: function(e) {
  //   MailAction.setNewTemplate(this.state.show, this.state.text);
  // },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      show: MailStore.getSaveNewTemplateFlag(),
      text: MailStore.getNewTemplateName()
    });
  },
  getInitialState: function() {
    return {
      show: false,
      text: null
    };
  },
  render: function() {
    var boxStyle = {
        width: '189px',
        margin: '4px 0'
      },
      iconStyle = {
        height: '16px',
        width: '16px',
        margin: '2px 10px 0 0',
      },
      labelStyle = {
        fontSize: '14px',
        color: '#abafae',
        width: '155px'
      },
      textStyle = {
        border: '1px solid #ececec',
        backgroundColor: '#ffffff',
        flex: '1',
        fontSize: '14px',
        height: '28px',
        padding: '0 10px'
      },
      underlineStyle = {
        borderBottom: '1px solid transparent',
      },
      underlineFocusStyle = {
        borderColor: 'transparent'
      },
      hintStyle = {
        bottom: '1px'
      },
      errorStyle = {
        marginTop: '8px'
      };
    var textProps = {
      style: textStyle,
      underlineStyle: underlineStyle,
      underlineFocusStyle: underlineFocusStyle,
      value: this.state.text,
      onChange: this._onTextChanged,
      //  onBlur: this._onTextBlur,
      hintText: I18N.Mail.TemplateHintText,
      hintStyle: hintStyle,
      errorText: this.props.errorText,
      errorStyle: errorStyle
    };
    var text = (this.state.show) ? <TextField {...textProps}/> : null;
    return (
      <div className='jazz-newTemplate'>
        <Checkbox
      ref='checkbox'
      style={boxStyle}
      iconStyle={iconStyle}
      labelStyle={labelStyle}
      label={I18N.Mail.SaveNewTemplate}
      onCheck={this._onCheck}
      checked={this.state.show}/>


      {text}
      </div>
      );
  },
});
module.exports = MailSaveNewTemplate;
