'use strict';

import React from 'react';
import mui from 'material-ui';
import assign from 'object-assign';
import classNames from 'classnames';
import JumpBox from './JumpBox.jsx';
let {Checkbox, FlatButton, TextField, Mixins} = mui;

var Pagination = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    curPageNum: React.PropTypes.number,
    totalPageNum: React.PropTypes.number,
    previousPage: React.PropTypes.func,
    nextPage: React.PropTypes.func,
    jumpToPage: React.PropTypes.func,
    hasJumpBtn: React.PropTypes.bool,
  },

  getDefaultProps: function() {
    return {
      hasJumpBtn: false,
      jumpToPage: function () {}
    };
  },

  getInitialState: function() {
    return {
      showBox: false
    };
  },

  jumpToPage: function (targetPage) {
    if(Number.isInteger(targetPage) && targetPage > 0 && targetPage <= this.props.totalPageNum){
      this.props.jumpToPage(targetPage);
      this.dismissJumpBox();
    }
  },

  showJumpBox: function () {
    this.setState({
      showBox: !this.state.showBox
    });
  },

  dismissJumpBox: function () {
    this.setState({
      showBox: false
    });
  },

  render: function(){
    var prePageBtn = null;
    if(this.props.curPageNum > 1){
      prePageBtn = (
        <div className="pre-btn" onClick={this.props.previousPage}>上一页</div>
      );
    }
    var nextPageBtn = null;
    if(this.props.curPageNum < this.props.totalPageNum){
      nextPageBtn = (
        <div className="next-btn" onClick={this.props.nextPage}>下一页</div>
      );
    };
    var page=((this.props.totalPageNum==0)?0:this.props.curPageNum);
    var pageNum = (
      <div className="page-num">{page}/{this.props.totalPageNum}页</div>
    );

    var jumpBtn = null;
    if(this.props.hasJumpBtn){
      var jumpBox = null;
      if(this.state.showBox){
        var jumpBoxProps = {
          handleClickAway: this.dismissJumpBox,
          jumpToPage: this.jumpToPage
        };
        jumpBox = (
          <JumpBox {...jumpBoxProps}/>
        );
      }
      jumpBtn = (
       <div className="page-jump">
         <div className="jump-btn" onClick={this.showJumpBox}>跳转</div>
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
