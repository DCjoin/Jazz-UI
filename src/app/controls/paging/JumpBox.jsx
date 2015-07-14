'use strict';

import React from 'react';
import mui from 'material-ui';
import assign from 'object-assign';
import classNames from 'classnames';
let { FlatButton, TextField, Mixins } = mui;

var JumpBox = React.createClass({
  mixins: [Mixins.ClickAwayable, React.addons.PureRenderMixin],

  PropTypes: {
    handleClickAway: React.PropTypes.func.isRequired,
    jumpToPage: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.refs.pageNumField.focus();
  },

  jumpToPage: function () {
    var targetPage = Number(this.refs.pageNumField.getValue());
    this.props.jumpToPage(targetPage);
  },

  componentClickAway: function () {
    this.props.handleClickAway();
  },

  render: function () {
    return (
      <div className="page-jump-box">
        <div className="jump-input">
          <div className="jump-text">跳转到第</div>
          <TextField ref="pageNumField" style={{width: "48px"}}/>
          <div className="jump-text">页</div>
          <FlatButton mini={true} label="跳转" onClick={this.jumpToPage}/>
        </div>
      </div>
    );
  }
});

module.exports = JumpBox;
