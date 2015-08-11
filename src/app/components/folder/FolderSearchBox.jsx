'use strict';
import React from "react";
import {Navigation, State } from 'react-router';
import {FontIcon,TextField} from 'material-ui';
import Search from './FolderSearchPaper.jsx';
import FolderStore from '../../stores/FolderStore.jsx';

import Immutable from 'immutable';

var FileSearchBox = React.createClass({
  propTypes: {
    onSearchClick:React.PropTypes.func.isRequired,
},
  _onSearchClick:function(){
    React.findDOMNode(this.refs.searchIcon).style.display='none';
    if(this.refs.searchText.getValue()){
      this.setState({
        showPaper:true,
      })
    }
  },
  _onSearchChange:function(e){
    var value= e.target.value;

    if(value){
       React.findDOMNode(this.refs.cleanIcon).style.display='block';
       this.setState({
         showPaper:true,
         searchValue:value
       })
         }
       else{
           React.findDOMNode(this.refs.cleanIcon).style.display='none';
           this.setState({
             showPaper:false,
           })
         }
  },
  _onCleanButtonClick:function(){
    React.findDOMNode(this.refs.cleanIcon).style.display='none';
    this.refs.searchText.setValue("");
    this.setState({
      showPaper:false
    })
  },
  _onSearchBlur:function(e){
    if(!e.target.value){
        React.findDOMNode(this.refs.searchIcon).style.display='block';
    }
  },
  _onSearchNodeClick:function(node){
    this.props.onSearchClick(Immutable.fromJS(node));
  },
  _handleClickAway:function(){
    this.setState({
      showPaper:false
    })
  },
  getInitialState:function(){
    return{
      showPaper:false,
      searchValue:null
    };
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
  var searchPaper;
    if(this.state.showPaper){
      var tree=FolderStore.getFolderTree();
      var searchProps={
        allNode:tree.toJSON(),
        onSearchNodeClick:this._onSearchNodeClick,
        searchValue:this.state.searchValue,
        handleClickAway:this._handleClickAway
      };
      searchPaper=<Search {...searchProps}/>;
    };

    return(
      <div>
        <label className="jazz-folder-leftpanel-searchbox" onBlur={this._onSearchBlur}>
            <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
            <TextField style={textFieldStyle} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearchChange}/>
            <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
        </label>
        {searchPaper}
      </div>

    )
  }

});
module.exports = FileSearchBox;
