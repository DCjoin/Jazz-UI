'use strict';

import React from 'react';
import mui from 'material-ui';
import assign from 'object-assign';
import classNames from 'classnames';
let {FlatButton, TextField} = mui;

var Pagination = React.createClass({
  propTypes: {
    curPageNum: React.PropTypes.number,
    totalPageNum: React.PropTypes.number,
    onPrePage: React.PropTypes.func,
    onNextPage: React.PropTypes.func,
    jumpToPage: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      jumpToPage: function () {}
    };
  },

  getInitialState: function() {
    return {
      showBox: false
    };
  },

  jumpToPage: function () {
    var targetPage = Number(this.refs.pageNumField.getValue());
    if(Number.isInteger(targetPage) && targetPage > 0 && targetPage <= this.props.totalPageNum){
      this.props.jumpToPage(targetPage);
      this.dismissJumpBox();
    }
  },

  showJumpBox: function () {
    this.setState({
      showBox: !this.state.showBox
    }, function () {
      if(this.state.showBox){
        this.refs.pageNumField.focus();
      }
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
        <div className="pre-btn" onClick={this.props.onPrePage}>上一页</div>
      );
    }
    var nextPageBtn = null;
    if(this.props.curPageNum < this.props.totalPageNum){
      nextPageBtn = (
        <div className="next-btn" onClick={this.props.onNextPage}>下一页</div>
      );
    }
    var pageNum = (
      <div className="page-num">{this.props.curPageNum}/{this.props.totalPageNum}</div>
    );

    var jumpBtn = null;

      var jumpBox = null;
      if(this.state.showBox){
        jumpBox = (
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
      jumpBtn = (
       <div className="page-jump">
         <div className="jump-btn" onClick={this.showJumpBox}>跳转</div>
         {jumpBox}
       </div>
     );


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
