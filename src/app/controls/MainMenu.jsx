'use strict';

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router';
import { Mixins, DropDownMenu } from 'material-ui';
let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
import classnames from "classnames";

import BubbleIcon from '../components/BubbleIcon.jsx';

var SubMainMenu = React.createClass({
  mixins: [State, Mixins.ClickAwayable, Navigation],

  getInitialState: function() {
    return {
      showSubMenu: false
    };
  },

  propTypes: function() {
    return {
      node: React.PropTypes.object,
      params: React.PropTypes.object
    };
  },

  getDefaultProps: function() {
    return {
      node: {},
      params: {}
    };
  },

  _onMenuItemClick: function(e, item) {

    this.transitionTo(item.props.name, this.props.params);
    this._dismissSubMain();


  },

  componentClickAway: function() {
    this._dismissSubMain();
  },

  render: function() {
    var {node, _renderMenuItems, params} = this.props,
      {showSubMenu} = this.state,
      {isActive, activeTitle} = this._checkSubIsActive(node.children);
    var menu = null;
    var menuItems = this.props.node.children.map((item) => {
      return <MenuItem primaryText={item.title} name={item.name} style={{
          fontSize: '14px',
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          width: isActive ? '120px' : '100px'
        }}/>;
    });
    if (showSubMenu) {
      menu = <Menu
      style={{
        left: 0
      }}
      ref="menuItems"
      autoWidth={false}
      onItemTouchTap={this._onMenuItemClick}
      >{menuItems}</Menu>;
    }

    return (
      <div
      ref="root"
      className={"jazz-mainmenu-level-main"}>

          <a className={classnames({
        "jazz-mainmenu-main": true,
        "active": isActive
      })} onMouseEnter={this._showSubMenu} onMouseLeave={this._dismissSubMain}>
            <div>{node.title}</div>
            <div className="jazz-mainmenu-main-title">{activeTitle}</div>
            {menu}
          </a>

      </div>
      );
  },

  _showSubMenu: function() {
    this.setState({
      showSubMenu: true
    });
  },

  _dismissSubMain: function() {
    var me = this;
    window.setTimeout(() => {
      me.setState({
        showSubMenu: false
      });
    }, 200);
  },

  _checkSubIsActive: function(children) {
    var that = this,
      hasActive = false,
      title = null;
    children.every((item) => {
      if (that.isActive(item.name)) {
        title = item.title;
        hasActive = true;
        return false;
      }
      return true;
    });
    return {
      isActive: hasActive,
      activeTitle: title
    };
  },
});

var MainMenu = React.createClass({

  propTypes: {
    items: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired
  },
  _onChange: function() {
    this.setState({});
  },
  _renderMenuItems: function(items, params, parent) {

    var that = this,
      links = items.map(item => {
        if (item.children) {
          var subMainMenuProps = {
            params,
            node: item,
            _renderMenuItems: this._renderMenuItems
          };
          return (
            <SubMainMenu key={item.name} {...subMainMenuProps}/>
            );

        } else {

          var redBubble = null;
          if (item.hasBubble) {
            if (item.bubbleProps && item.bubbleProps.number) {
              redBubble = <div className="jazz-mainmenu-main-bubble"><BubbleIcon {...item.bubbleProps}/></div>;
            }
          }

          return (<Link key={item.name} className={classnames({
              "jazz-mainmenu-main": parent,
              "jazz-mainmenu-sub": !parent
            })} to={item.name} params={params}  onClick={this.props.onClick}>{item.title}{redBubble}</Link>);

        }
      });
    return links;
  },

  render: function() {
    var params = this.props.params;

    var links = this._renderMenuItems(this.props.items, params, true);

    return (
      <div className="jazz-menu">
          {links}
      </div>
      );
  }

});


module.exports = MainMenu;
