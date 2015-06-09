'use strict';
import React from "react";
import { Route, DefaultRoute, RouteHandler, Link, Navigation, State } from 'react-router';
import {IconButton,DropDownMenu,DatePicker,FlatButton,FontIcon,Menu} from 'material-ui';
import classnames from 'classnames';
import HierarchyButton from './HierarchyButton.jsx';
import DimButton from './DimButton.jsx';
import TagStore from '../stores/TagStore.jsx';
import TagAction from '../actions/TagAction.jsx'

var menuItems = [
   { payload: '1', text: '全部' },
   { payload: '2', text: '报警已配置' },
   { payload: '3', text: '基准值已配置' },
   { payload: '4', text: '未配置' },

];
var page=0,total=0;
let DataSelectMainPanel=React.createClass({
    mixins:[Navigation,State],

    getInitialState: function() {
      return {
        dimActive:false,
        dimNode:null,
        dimParentNode:null,
        HierarchyShow:false,
        DimShow:true,
        tagList:null
      };
    },

    _onHierachyTreeClick:function(node){
      page=1;
      TagAction.loadall(node,1);
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
    _onChange:function(){
      var data=TagStore.getDate();
      total=data.total;



      this.setState({
        tagList:data.GetTagsByFilterResult
      })
    },
    componentDidMount: function() {
      TagStore.addChangeListener(this._onChange);

     },
     componentWillUnmount: function() {

       TagStore.removeChangeListener(this._onChange);

      },

      drawTagMenu:function(){
        let nodemenuItems=[];
        let menuItem;
        var payloadNo=0;
        this.state.tagList.forEach(function(nodeData,i){
          payloadNo++;
           menuItem={payload:payloadNo,text:nodeData.Name,node:nodeData};
           nodemenuItems.push(menuItem);
        });
        var buttonStyle = {
             height:'30px',
         };
         var pageButtonStyle = {
                 width:'20px'
                    };

 return(
   <div>

   <div style={{height:'700px'}}>
     <Menu menuItems={nodemenuItems} autoWidth={false} menuItemStyle={buttonStyle}/>
  </div>
  <div style={{display:'inline-block'}}>
    <FlatButton style={pageButtonStyle} onClick={this._onLeftPage}>
    <FontIcon className="fa fa-caret-left" style={{margin:'30px'}}/>
    </FlatButton>

    <FlatButton style={pageButtonStyle} onClick={this._onRightPage}>
    <FontIcon className="fa fa-caret-right" style={{margin:'30px'}} />
    </FlatButton>
  </div>
</div>


 )
      },
      _onLeftPage:function(){
       if(page>1){
         page--;
         TagAction.loadall(this.state.dimParentNode,page);
       }
      },
      _onRightPage:function(){
        if(20*page<total){
          page++;
          TagAction.loadall(this.state.dimParentNode,page);
        }
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

        var menupaper;
      if(this.state.tagList){
        menupaper=this.drawTagMenu();
      }
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
          {menupaper}
        </div>

      )
    }
  });


  module.exports = DataSelectMainPanel;
