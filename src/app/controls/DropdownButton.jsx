'use strict';

import React from 'react';
import mui from 'material-ui';
import classSet from 'classnames';
let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');

let {
  Mixins,
  IconButton,
  FlatButton,
  FontIcon
} = mui;

let {
  ClickAwayable
} = Mixins;

var DropdownButton = React.createClass({
  mixins: [ClickAwayable],
  getInitialState: function () {
    return {
      open: false,
      rendered: false
    };
  },
  componentClickAway: function () {
    if (this.state.open) {
      this.setState({
        open: false
      });
    }
  },
  _showMenu: function (argument) {
    this.setState({
      open: !this.state.open,
      rendered: true
    });
  },
  _onMenuItemClick: function (e,item) {
    this.setState({
      open: false
    });
    this.props.onItemClick(e, item);
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
    var listStyle={
      marginTop:'30px'
    };
    var menuProps={
      onItemTouchTap:this._onMenuItemClick,
      style:listStyle,
      openDirection:'bottom-right'
    };
    if (!this.props.disabled && this.state.open) {
      // menuList = (
      //     <Menu autoWidth={true} hideable={true} menuItemStyle={{lineHeight:'32px'}} menuItems={this.props.menuItems} onItemTap={this._onMenuItemClick} ref="menuItems" style={{fontSize:'14px',top:'none'}} visible={this.state.open} menuItemClassName="menu_item"/>
      // );
      menuList = (
        <Menu {...menuProps}>
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
    var buttonStyle = {
      backgroundColor: 'transparent',
      height: '32px'
    };

    return (
      <div className={classSet(classes)} style={{display:'inline-block'}}>
        <FlatButton disabled={buttonDisabled} onClick={this._showMenu} style={buttonStyle}>
          <FontIcon className="fa icon-add btn-icon"/>
          <span className="mui-flat-button-label btn-text">{this.props.text}</span>
        </FlatButton>
          {menuList}
      </div>
    );
  }

});

module.exports = DropdownButton;
