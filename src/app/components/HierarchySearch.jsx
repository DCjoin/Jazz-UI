'use strict';
import React from "react";
import classNames from 'classnames';
import {Paper,Menu} from 'material-ui';
import {nodeType} from '../constants/TreeConstants.jsx';

let treeMap=new Array();
var itemUnit=48;
var nodetypename=[
                  "客户",
                  "组织",
                  "园区",
                  "楼宇"
]
let SearchItem = React.createClass({
  propTypes: {
      nodeData: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func.isRequired
  },
  _onClick:function(){
    this.props.onClick(this.props.nodeData)
  },
  render:function(){
    var icon = (
      <div className={classNames({
        "icon-customer": this.props.nodeData.Type == nodeType.Customer,
        "icon-orgnization": this.props.nodeData.Type == nodeType.Organization,
        "icon-site": this.props.nodeData.Type == nodeType.Site,
        "icon-building": this.props.nodeData.Type == nodeType.Building,
        "icon-room": this.props.nodeData.Type == nodeType.Room,
        "icon-panel": this.props.nodeData.Type == nodeType.Panel,
        "icon-device": this.props.nodeData.Type == nodeType.Device
      })}></div>
    );

    return(
      <div className="jazz-searchmenuitem" onClick={this._onClick}>
      <div style={{'font-size':'16px'}}>
      {icon}
    </div>
    <div className='jazz-hiersearch-nodename' title={this.props.nodeData.Name}>
    {this.props.nodeData.Name}</div>
      </div>
    )
  }
});
let HierarchySearch = React.createClass({
  propTypes: {
      allNode: React.PropTypes.object.isRequired,
      onSearchNodeClick:React.PropTypes.func.isRequired,
      searchValue: React.PropTypes.string,

  },
  _onItemClick:function(e, index, menuItem){

    this.props.onSearchNodeClick(menuItem.node);
  },
  drawNodeType:function(){
    let nodetype=[];
    let nodemenu=[];
    let that=this;
    var searchvalue=this.props.searchValue;
    var payloadNo=0;
    var nodelength=0;
    var lastpayloadNo=0;

    nodetype.length=0;
    nodemenu.length=0;
    treeMap.forEach(function(node,i){
      var typeItem;
      var hasSearchValue=false;
      var nodemenuItems=[];
      node.forEach(function(nodeData,i){
        let menuItem;
        var name=(nodeData.Name).toLocaleUpperCase();
        if(name.indexOf(searchvalue.toLocaleUpperCase())>=0){
          hasSearchValue=true;

          if(nodemenuItems.length==0){
            nodemenuItems.push(
              <div style={{'padding-top':'10px'}}>
                <SearchItem nodeData={nodeData}
                            onClick={that.props.onSearchNodeClick}/>
              </div>

            )
          }
           else {
             nodemenuItems.push(
                 <SearchItem nodeData={nodeData}
                             onClick={that.props.onSearchNodeClick}/>
             )
           }
          }

      });

if(hasSearchValue){
  if(nodemenu.length==0){
    nodemenu.push(
      <div style={{display:'flex','flex-flow':'row'}}>
        <div className="jazz-search-nodetype" >
            {nodetypename[node[0].Type+1]}
        </div>
        <div style={{'margin-left':'10px',flex:1}}>
        {nodemenuItems}
        </div>
      </div>
    );
  }
  else {
    nodemenu.push(
      <div style={{display:'flex','flex-flow':'row'}}>
        <div className="jazz-search-nodetype" >
            {nodetypename[node[0].Type+1]}
        </div>
        <div style={{'margin-left':'10px',flex:1}}>
        {nodemenuItems}
        </div>
        </div>
    );
  }
}

    })
    return(
        <div className="jazz-search" >
          {nodemenu}

          </div>
    );
  },

  render : function() {
    var dataSource = this.props.allNode;
        treeMap.length=0;
    var  traverse=function(data){
      if(Array.isArray(data)){
        data.forEach(function(node){

          if(treeMap[node.Type+1]==null) {
            treeMap[node.Type+1]=new Array();
          };

          treeMap[node.Type+1].push(node);
          if(Array.isArray(node.Children)){
            traverse(node.Children);
          }
        });
      } else if(data) {
        if(treeMap[data.Type+1]==null) {
          treeMap[data.Type+1]=new Array();
        };

        treeMap[data.Type+1].push(data);
        if(Array.isArray(data.Children)){
          traverse(data.Children);
        }
      }
    }
    traverse(dataSource);


    return(
      <div>
        {this.drawNodeType()}
        <div className="jazz-search-divider"/>
      </div>

      )
  }
});

module.exports = HierarchySearch;
