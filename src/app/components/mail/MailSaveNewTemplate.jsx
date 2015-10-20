'use strict';

import React from 'react';
import { Checkbox, TextField } from 'material-ui';
import MailAction from '../../actions/MailAction.jsx';

let MailSaveNewTemplate = React.createClass({
  _onCheck: function() {
    var checked = this.refs.checkbox.isChecked();

    this.setState({
      show: checked,
      text: null
    });

    MailAction.setNewTemplate(checked, null);
  },
  _onTextChanged: function(e) {
    this.setState({
      text: e.target.value
    });
  },
  _onTextBlur: function(e) {
    MailAction.setNewTemplate(this.state.show, this.state.text);
  },
  getInitialState: function() {
    return {
      show: false,
      text: null
    };
  },
  render: function() {
    var boxStyle = {
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
      };
    var textProps = {
      style: textStyle,
      underlineStyle: underlineStyle,
      underlineFocusStyle: underlineFocusStyle,
      value: this.state.text,
      onChange: this._onTextChanged,
      onBlur: this._onTextBlur
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
