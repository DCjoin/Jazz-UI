'use strict';
import PropTypes from 'prop-types';
import React from 'react';
import {Checkbox, FlatButton, TextField, Mixins} from 'material-ui';
import assign from 'object-assign';
import classNames from 'classnames';
import JumpBox from './JumpBox.jsx';
var createReactClass = require('create-react-class');
var Pagination = createReactClass({
  //mixins: [React.addons.PureRenderMixin],

  propTypes: {
    curPageNum: PropTypes.number,
    totalPageNum: PropTypes.number,
    previousPage: PropTypes.func,
    nextPage: PropTypes.func,
    jumpToPage: PropTypes.func,
    hasJumpBtn: PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      hasJumpBtn: false,
      jumpToPage: function() {}
    };
  },

  getInitialState: function() {
    return {
      showBox: false
    };
  },

  jumpToPage: function(targetPage) {
    if (targetPage > 0 && targetPage <= this.props.totalPageNum) {
      this.props.jumpToPage(targetPage);
      this.dismissJumpBox();
    }
  },

  showJumpBox: function() {
    this.setState({
      showBox: !this.state.showBox
    });
  },

  dismissJumpBox: function() {
    this.setState({
      showBox: false
    });
  },

  render: function() {
    var prePageBtn = null;
    if (this.props.curPageNum > 1) {
      prePageBtn = (
        <div className="pre-btn" onClick={this.props.previousPage}>{I18N.Paging.Button.PrePage}</div>
      );
    }
    var nextPageBtn = null;
    if (this.props.curPageNum < this.props.totalPageNum) {
      nextPageBtn = (
        <div className="next-btn" onClick={this.props.nextPage}>{I18N.Paging.Button.NextPage}</div>
      );
    }
    ;
    var page = ((this.props.totalPageNum == 0) ? 0 : this.props.curPageNum);
    var pageNum = (
    <div className="page-num">{page}/{this.props.totalPageNum}{I18N.Paging.Page}</div>
    );

    var jumpBtn = null;
    if (this.props.hasJumpBtn) {
      var jumpBox = null;
      if (this.state.showBox) {
        var jumpBoxProps = {
          handleClickAway: this.dismissJumpBox,
          jumpToPage: this.jumpToPage,
          totalPageNum: this.props.totalPageNum
        };
        jumpBox = (
          <JumpBox {...jumpBoxProps}/>
        );
      }
      jumpBtn = (
        <div className="page-jump">
         <div className="jump-btn" onClick={this.showJumpBox}>{I18N.Paging.Jump}</div>
         {jumpBox}
       </div>
      );
    }

    return (
      <div className="buttonBar">
        {pageNum}
        {prePageBtn}
        {nextPageBtn}
        {jumpBtn}
      </div>
      );
  }
});

module.exports = Pagination;
