'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {FontIcon,TextField} from 'material-ui';

var FileSearchBox = React.createClass({
  _onSearchClick:function(){
    React.findDOMNode(this.refs.searchIcon).style.display='none';
  },
  _onSearchChange:function(e){
    var value= e.target.value;

    if(value){
       React.findDOMNode(this.refs.cleanIcon).style.display='block';
         }
       else{
           React.findDOMNode(this.refs.cleanIcon).style.display='none';
         }
  },
  _onCleanButtonClick:function(){
    React.findDOMNode(this.refs.cleanIcon).style.display='none';
    this.refs.searchText.setValue("");
  },
  _onSearchBlur:function(e){
    if(!e.target.value){
        React.findDOMNode(this.refs.searchIcon).style.display='block';
    }
  },
  render:function(){
    var  searchIconStyle={
                        fontSize:'20px'
                        },
        cleanIconStyle={
                        marginTop:'3px',
                        fontSize:'16px',
                        display:'none'
                        },
        textFieldStyle={
                        flex:'1',
                        height:'26px'
                      };
    return(
      <label className="jazz-folder-leftpanel-searchbox" onBlur={this._onSearchBlur}>
          <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
          <TextField style={textFieldStyle} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearchChange}/>
          <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
      </label>
    )
  }

});
module.exports = FileSearchBox;
