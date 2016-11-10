'use strict';
import React from "react";
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';


function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

let ExtendableMenuItem = React.createClass({
  propTypes:{
    subItems: React.PropTypes.array
  },
  getInitialState(){
    this.itemOverTimeouts = [];
    this.subMenuOverTimeouts = [];
    return { itemMouseOver: false,
             subMenuMouseOver: false};
  },
  componentDidUpdate(){
    if(this.refs.subMenu){
      var subMenu=React.findDOMNode(this.refs.subMenu),
      menus=React.findDOMNode(this.refs.menus),
      box=menus.getBoundingClientRect();
      if(box.left+menus.scrollWidth>document.body.offsetWidth){
        subMenu.style.left=-(menus.scrollWidth+5)+'px';
      }
    }


  },
  render(){
    let me = this;
    let subMenu = null;
    let other = _objectWithoutProperties(this.props, [ 'subItems', 'tooltip']);
    let tooltipStr = this.props.tooltip || null;

    if((this.state.itemMouseOver || this.state.subMenuMouseOver) && this.props.subItems && this.props.subItems.length > 0 ){
      let subItems = this.props.subItems;
      subItems = subItems.map((item)=>{
        return <MenuItem {...item}/>;
      });
      subMenu = <div ref='subMenu' style={{position:'absolute',overflow:'visible', display:'inline-block',left:'inherit'}}>
                  <Menu ref='menus' onMouseOver={me._onSubMenuMouseOver} onItemTouchTap={me._onSubMenuItemTouchTap}
                      onMouseOut={me._onSubMenuMouseOut} style={{left:'2px'}} desktop={true}>{subItems}</Menu>
                </div> ;
    }
    return <div style={{position:'relative'}} onMouseOver={me._onItemMouseOver} onMouseOut={me._onItemMouseOut} title={tooltipStr}>
              <div style={{display:'inline-block', width:'100%'}}>
                <MenuItem {...other}></MenuItem>
              </div>
              {subMenu}

    </div>;
  },
  _onSubMenuItemTouchTap(e, item){
    this.props.onTouchTap(item);
  },
  _onItemMouseOver(){
    this.itemOverTimeouts.forEach((item)=>{
      window.clearTimeout(item);
    });
    this.itemOverTimeouts.length = 0;
    this.setState({itemMouseOver:true});
  },
  _onItemMouseOut(){
    let me = this;
    this.itemOverTimeouts.push(window.setTimeout(()=>{
      me.setState({itemMouseOver:false});
    },200));
  },
  _onSubMenuMouseOver(){
    this.subMenuOverTimeouts.forEach((item)=>{
      window.clearTimeout(item);
    });
    this.subMenuOverTimeouts.length = 0;
    this.setState({subMenuMouseOver:true});
  },
  _onSubMenuMouseOut(){
    let me = this;
    this.subMenuOverTimeouts.push(window.setTimeout(()=>{
      me.setState({subMenuMouseOver:false});
    },200));
  }
});

module.exports = ExtendableMenuItem;
