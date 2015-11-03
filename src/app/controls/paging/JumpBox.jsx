'use strict';

import React from 'react';
import mui from 'material-ui';
import assign from 'object-assign';
import classNames from 'classnames';
import { Regex } from '../../util/Util.jsx';
let {FlatButton, TextField, Mixins} = mui;

var JumpBox = React.createClass({
  mixins: [Mixins.ClickAwayable, React.addons.PureRenderMixin],

  PropTypes: {
    handleClickAway: React.PropTypes.func.isRequired,
    jumpToPage: React.PropTypes.func.isRequired,
    totalPageNum: React.PropTypes.number.isRequired
  },

  getInitialState: function() {
    return {
      errorText: ""
    };
  },

  componentDidMount: function() {
    this.refs.pageNumField.focus();
  },

  jumpToPage: function() {
    var targetPage = Number(this.refs.pageNumField.getValue());
    if (Regex.PositiveInterger.test(targetPage)) {
      this.props.jumpToPage(targetPage);
    }
  },

  componentClickAway: function() {
    this.props.handleClickAway();
  },

  inputOnChange: function(e) {
    var value = e.target.value;
    if (!this.validInput(value)) {
      this.setState({
        errorText: I18N.Paging.Error.Pre + this.props.totalPageNum + I18N.Paging.Error.Next,
      });
    } else {
      this.setState({
        errorText: "",
      });
    }
  },

  validInput: function(value) {
    var validation = false;
    if (Regex.PositiveInterger.test(value)) {
      validation = value > 0 && value <= this.props.totalPageNum;
    }
    return validation;
  },

  render: function() {
    var inputTextFieldProps = {
      ref: "pageNumField",
      style: {
        width: "48px"
      },
      onChange: this.inputOnChange,
      errorText: this.state.errorText,
      errorStyle: {
        "overflow": "visible",
        "whiteSpace": "nowrap"
      }
    };
    var inputTextField = (
    <TextField {...inputTextFieldProps}/>
    );

    return (
      <div className="page-jump-box">
        <div className="jump-input">
          <div className="jump-text">{I18N.Paging.JumpTo}</div>
          {inputTextField}
          <div className="jump-text">{I18N.Paging.Page}</div>
          <FlatButton mini={true} label={I18N.Paging.Jump} onClick={this.jumpToPage}/>
        </div>
      </div>
      );
  }
});

module.exports = JumpBox;
