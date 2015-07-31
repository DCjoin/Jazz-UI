'use strict';
import React from "react";

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');


function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

let ExtendableMenuItem = React.createClass({
  propTypes:{
    subMenu: React.PropTypes.element.isRequired
  },
  getInitialState(){
    return {showSubmenu:false};
  },
  render(){
    let me = this;
    let subMenu = null;
    let other = _objectWithoutProperties(this.props, [ 'children']);

    if(this.state.showSubmenu){
      subMenu = <div style={{position:'relative',overflow:'visible', left:'114px', top:'-48px'}}>
                  {this.props.children}
                </div> ;
    }
    return <div style={{position:'relative'}} onMouseOver={me._onItemMouseOver} onMouseOut={me._onItemMouseOut}>
              <MenuItem {...other}></MenuItem>
              {subMenu}
    </div>;
  },
  _onItemMouseOver(){
    this.setState({showSubmenu:true});
  },
  _onItemMouseOut(){
    this.setState({showSubmenu:false});
  }
});

module.exports = ExtendableMenuItem;
