'use strict';

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router';
import { Mixins, DropDownMenu, Menu } from 'material-ui';
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

  _onMenuItemClick: function(e, index, payload) {

    this.transitionTo(payload.name, this.props.params);
    this._dismissSubMain();


  },

  componentClickAway: function() {
    this._dismissSubMain();
  },

  render: function() {
    var {node, _renderMenuItems, params} = this.props,
      {showSubMenu} = this.state,
      {isActive, activeTitle} = this._checkSubIsActive(node.children);

    var menuItems = this.props.node.children.map((item) => {
      item.text = item.title;
      item.payload = item.name;
      return item;
    });

    return (
      <div
      ref="root"
      className={"jazz-mainmenu-level-main"}>

          <a className={classnames({
        "jazz-mainmenu-main": true,
        "active": isActive
      })} onClick={this._showSubMenu}>
            <div>{activeTitle}</div>
            <div className="jazz-mainmenu-main-title">{node.title}</div>
          </a>
          <Menu
      style={{
        left: 0
      }}
      ref="menuItems"
      autoWidth={false}
      menuItems={menuItems}
      menuItemStyle={{
        paddingRight: 0,
        paddingLeft: 8
      }}
      hideable={true}
      visible={this.state.showSubMenu}
      onItemTap={this._onMenuItemClick} />
      </div>
      );
  },

  _showSubMenu: function() {
    this.setState({
      showSubMenu: true
    });
  },

  _dismissSubMain: function() {
    this.setState({
      showSubMenu: false
    });
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
