'use strict';

import React from 'react';
import mui from 'material-ui';
import Add from './icons/Add.jsx';
import classSet from 'classnames';
import assign from 'lodash-es/assign';

// import PopoverAnimationFromTop from '../../../node_modules/material-ui/lib/popover/popover-animation-from-top';

import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import ClickAwayListener from './ClickAwayListener.jsx';

var NewDropdownButton = React.createClass({
  getDefaultProps: function() {
    return {
      labelPosition:'before'
    };
  },
  getInitialState: function () {
    return {
      open: false,
      rendered: false
    };
  },

  _showMenu: function (argument) {
    this.setState({
      open: !this.state.open,
      rendered: true
    });
  },
  _onMenuItemClick: function (e, value) {
    this.setState({
      open: false
    });
    this.props.onItemClick(e, value);
  },

  _closeDropdown(){
    this.setState({
      open: false
    });
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.menuItems.length != this.props.menuItems.length) {
      this.setState({
        rendered: false,
        open: false
      });
    }
  },
  render: function () {
    var menuList = null;
    if (!this.props.disabled) {
    menuList = (
      <Menu
        autoWidth={true}
        hideable={true}
        menuItemStyleLink={{lineHeight:'32px'}}
        onChange={this._onMenuItemClick}
        ref="menuItems"
        style={{width:220,fontSize:'14px',top:'none',visibility:this.state.open?"visible":"hidden"}}
        visible={this.state.open}
        menuItemClassName="menu_item">
        {this.props.menuItems}
      </Menu>
    );
    }
    var buttonDisabled = false;
    var opacity = 1;
    if (this.props.menuItems.length === 0 || this.props.disabled) {
      buttonDisabled = true;
      opacity = 0.4;
    }
    var classes = {
      'se-dropdownbutton': true,
      'mui-open': this.state.open,
      'btn-container': true,
      'btn-container-active': !buttonDisabled
    };
    var buttonStyle = assign({
      width:'73px',
      minWidth:'73px',
      height: '30px',
      borderRadius: '2px',
      border: 'solid 1px #32ad3d',
      lineHeight:'28px'
    }, this.props.buttonStyle);
    return (
      <div ref="root" className={classSet(classes)} style={{display:'inline-block'}}>
        <FlatButton disabled={buttonDisabled} onClick={this._showMenu} style={buttonStyle}>
          {this.props.labelPosition==='before' && <span className="mui-flat-button-label new-btn-text">{this.props.text}</span>}
          <FontIcon className={
            classSet("fa new-btn-icon", this.props.buttonIcon)
          } color="#32ad3d" style={this.props.buttonStyle}/>
        {this.props.labelPosition==='after' && <span className="mui-flat-button-label new-btn-text">{this.props.text}</span>}
        </FlatButton>
        <Popover
          onRequestClose = {this._closeDropdown}
          anchorEl={this.refs.root}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={this.state.open}>
          {menuList}
        </Popover>
      </div>
    );
  }

});

module.exports = NewDropdownButton;
