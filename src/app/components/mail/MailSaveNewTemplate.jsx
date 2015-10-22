'use strict';

import React from 'react';
import { Checkbox, TextField } from 'material-ui';
import MailAction from '../../actions/MailAction.jsx';
import MailStore from '../../stores/MailStore.jsx';

let MailSaveNewTemplate = React.createClass({
  propTypes: {
    errorText: React.PropTypes.string,
    clear: React.PropTypes.bool,
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
    var sendError = MailStore.GetSendError();
    if (sendError.newtemplate !== null) {
      sendError.newtemplate = null;
      MailAction.setSendError(sendError);
    }
    this.setState({
      text: e.target.value
    });
  },
  _onTextBlur: function(e) {
    MailAction.setNewTemplate(this.state.show, this.state.text);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.clear) {
      this.refs.checkbox.setChecked(false);
      this.setState({
        show: false,
        text: null
      });
    }
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
        margin: '6px 0'
      },
      iconStyle = {
        width: '24px',
        marginRight: '10px'
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
        height: '30px',
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
      onBlur: this._onTextBlur,
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
      onCheck={this._onCheck}/>

      {text}
      </div>
      );
  },
});
module.exports = MailSaveNewTemplate;
