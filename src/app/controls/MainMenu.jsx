'use strict';

import React from 'react';
import Link from 'react-router/lib/Link';
import { Mixins, DropDownMenu, Paper, Menu, MenuItem } from 'material-ui';
import classnames from "classnames";

import RoutePath from '../util/RoutePath.jsx';
import BubbleIcon from '../components/BubbleIcon.jsx';
import ClickAway from "../controls/ClickAwayListener.jsx";


var ListMenu = React.createClass({
  propTypes: function() {
    return {
      title: React.PropTypes.string
    };
  },
  contextTypes: {
    router: React.PropTypes.object,
    currentRoute: React.PropTypes.object,
  },
  render: function() {
    let {params} = this.context.currentRoute;
    let {push} = this.context.router;
    var title = this.props.title;
    var menuStyle = {
      fontSize: '14px',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      width: this.props.isActive ? '120px' : '110px'
    };
    var menuItems = this.props.menuItems.map((item) => {
      return <MenuItem primaryText={item.title} key={item.name} name={item.name} style={menuStyle} onTouchTap={() => {
        push(item.getPath(params));
      }}/>;
      // return <Link key={item.title} to={item.getPath(this.context.currentRoute.params)}>{item.title}</Link>
    });
    if (title) {
      menuItems.unshift(<MenuItem primaryText={title} key={title} disabled={true} style={menuStyle}/>);
    }
    var menu = <Menu
    style={{
      left: (this.props.isActive ? 120 : 80) * this.props.index
    }}
    ref="menuItems"
    autoWidth={false}
    menuItems={menuItems}
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
  // mixins: [State, Mixins.ClickAwayable, Navigation],

  getInitialState: function() {
    return {
      showSubMenu: false
    };
  },
  contextTypes: {
    router: React.PropTypes.object,
    currentRoute: React.PropTypes.object,
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

    // this.transitionTo(item.props.name, this.props.params);
    // let {push, params} = this.context.currentRoute;
    // push(RoutePath[item.props.name](params));
    // this.context.router.push()
    // this._dismissSubMain();


  },

  onClickAway: function() {
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
        // to change
        if (this.context.router.isActive(menu.getPath(this.context.currentRoute.params))) {
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

SubMainMenu=ClickAway(SubMainMenu);

var MainMenu = React.createClass({

  propTypes: {
    items: React.PropTypes.array.isRequired,
    params: React.PropTypes.object.isRequired
  },
  contextTypes: {
  router: React.PropTypes.object,
  currentRoute: React.PropTypes.object
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
            }else {
              redBubble = <div className="jazz-mainmenu-main-bubble"><BubbleIcon style={{width:'5px',height:'5px'}}/></div>
            }
          }
          if(item.title){
            return (<Link key={item.name} activeClassName={'active'} className={classnames({
                "jazz-mainmenu-main": parent,
                "jazz-mainmenu-sub": !parent
              })} to={item.getPath(params)} onClick={this.props.onClick}>
              {item.title}{redBubble}
            </Link>);
          }


        }
      });
    return links;
  },

  render: function() {
    var params = this.context.currentRoute.params;

    var links = this._renderMenuItems(this.props.items, params, true);

    return (
      <div className="jazz-menu">
          {links}
      </div>
      );
  }

});


module.exports = MainMenu;
