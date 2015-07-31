'use strict';
import React from "react";

let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');

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

    if(this.state.showSubmenu){
      subMenu = <div style={{position:'relative',overflow:'visible', left:'114px', top:'-48px'}}>
                  this.props.subMenu
                </div> ;
    }
    return <div style={{position:'relative'}} onMouseEnter={me._onItemMouseEnter} onMouseOut={me._onItemMouseOut}>
              <MenuItem {...this.props}></MenuItem>
              {subMenu}
    </div>;
  },
  _onItemMouseEnter(){
    this.setState({showSubmenu:true});
  },
  _onItemMouseOut(){
    this.setState({showSubmenu:false});
  }
});

module.exports = ExtendableMenuItem;
