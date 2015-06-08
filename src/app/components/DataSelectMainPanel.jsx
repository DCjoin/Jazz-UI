'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon} from 'material-ui';
import classnames from 'classnames';
import HierarchyButton from './HierarchyButton.jsx';
import DimButton from './DimButton.jsx';

var menuItems = [
   { payload: '1', text: '全部' },
   { payload: '2', text: '报警已配置' },
   { payload: '3', text: '基准值已配置' },
   { payload: '4', text: '未配置' },

];

let DataSelectMainPanel=React.createClass({
    mixins:[Navigation,State],
    getInitialState: function() {
      return {
        dimActive:false,
        dimNode:null,
        dimParentNode:null,
        HierarchyShow:false,
        DimShow:true
      };
    },
    _onHierachyTreeClick:function(node){
     this.setState({
       dimActive:true,
       dimParentNode:node
       })
    },
    _onHierarchButtonClick:function(){

      this.setState({
        HierarchyShow:true,
        DimShow:false
      })
    },
    _onDimButtonClick:function(){

      this.setState({
        HierarchyShow:false,
        DimShow:true
      })
    },

    render:function(){
      var buttonStyle = {
               height:'48px',
           };
      var dropdownmenuStyle = {
        width:'120px',
        float:'right',
        marginLeft: '5px'
                };

      return(
        <div className="jazz-dataselectmainpanel">

          <div  style={{display:'flex','flex-flow':'row nowrap','align-items':'center'}}>
            <HierarchyButton onTreeClick={this._onHierachyTreeClick} onButtonClick={this._onHierarchButtonClick} show={this.state.HierarchyShow}/>

            <FontIcon className="fa fa-minus" style={{margin:'30px'}}/>

            <DimButton active={this.state.dimActive} parentNode={this.state.dimParentNode} onButtonClick={this._onDimButtonClick} show={this.state.DimShow}/>
          </div>
          <div  style={{display:'inline-block','padding':'5px 0','border-width':'2px','border-style':'solid','border-color':'green transparent',width:'100%'}}>
            <label style={{display:'inline-block',width:'156px',height:'25px',border:'3px solid gray','border-radius':'20px','margin-top':'10px'}}>
              <img style={{float:'left'}} src={require('../less/images/search-input-search.png')}/>
              <input style={{width:'130px',height:'20px','background-color':'transparent',border:'transparent'}} placeholder="XX"/>
            </label>

            <DropDownMenu autoWidth={false} style={dropdownmenuStyle} menuItems={menuItems} />

          </div>

        </div>

      )
    }
  });


  module.exports = DataSelectMainPanel;
