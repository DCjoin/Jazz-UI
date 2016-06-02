'use strict';

import React from 'react';
import { Link, Navigation, State, RouteHandler } from 'react-router';
import { Mixins, DropDownMenu, Paper } from 'material-ui';
let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
import classnames from "classnames";

import BubbleIcon from '../components/BubbleIcon.jsx';


var ListMenu = React.createClass({
  propTypes: function() {
    return {
      title: React.PropTypes.string
    };
  },
  render: function() {
    var title = this.props.title;
    var menuStyle = {
      fontSize: '14px',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      width: this.props.isActive ? '120px' : '110px'
    };
    var menuItems = this.props.menuItems.map((item) => {
      return <MenuItem primaryText={item.title} name={item.name} style={menuStyle}/>;
    });
    if (title) {
      menuItems.unshift(<MenuItem primaryText={title} disabled={true} style={menuStyle}/>);
    }
    var menu = <Menu
    style={{
      left: (this.props.isActive ? 120 : 80) * this.props.index
    }}
    ref="menuItems"
    autoWidth={false}
    onItemTouchTap={this._onMenuItemClick}
    >{menuItems}</Menu>;
    return (
      <div
      ref="list"
      className={"jazz-mainmenu-level-main-list"}>
        {menu}
      </div>
      );
  },
  _onMenuItemClick: function(e, item) {
    this.props.onMenuItemClick(e, item);
  }
});

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
    var listItems = this.props.node.children.map((item, i) => {
      return <ListMenu title={item.title} menuItems={item.list} onMenuItemClick={this._onMenuItemClick} isActive={isActive} index={i}/>;
    });
    var listNum = this.props.node.children.length;
    if (showSubMenu) {
      menu = <Paper zDepth={1}>{listItems}</Paper>;
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
    this.setState({
      showSubMenu: false
    });
  },

  _checkSubIsActive: function(children) {
    var that = this,
      hasActive = false,
      title = null;
    children.every((item) => {
      item.list.every((menu) => {
        if (that.isActive(menu.name)) {
          title = menu.title;
          hasActive = true;
          return false;
        }
        return true;
      });
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
