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
    let nodemenuItems=[];
    var searchvalue=this.props.searchValue;
    var payloadNo=0;
    var nodelength=0;
    var lastpayloadNo=0;

    nodetype.length=0;
    nodemenuItems.length=0;
    treeMap.forEach(function(node,i){
      var typeItem;
      var hasSearchValue=false;

      node.forEach(function(nodeData,i){
        let menuItem;
        var name=(nodeData.Name).toLocaleUpperCase();
        if(name.indexOf(searchvalue.toLocaleUpperCase())>=0){
          payloadNo++;
          hasSearchValue=true;
          var icon = classNames({
              "fa fa-users": nodeData.Type == nodeType.Customer,
              "fa fa-hospital-o": nodeData.Type == nodeType.Organization,
              "fa fa-building-o": nodeData.Type == nodeType.Site,
              "fa fa-building": nodeData.Type == nodeType.Building,
              "fa fa-shirtsinbulk": nodeData.Type == nodeType.Room,
              "fa fa-server": nodeData.Type == nodeType.Panel,
              "fa fa-tablet": nodeData.Type == nodeType.Device
            });
             menuItem={payload:payloadNo,iconClassName:icon,text:nodeData.Name,node:nodeData};
             nodemenuItems.push(menuItem);

        }

      });


      if(hasSearchValue){
        if(nodelength==0){
          typeItem=<div className="jazz-hiersearch-type">{nodetypename[node[0].Type+1]}</div>
        }
        else{
          var nodeProps={
            style:{
              "margin-top":Number(nodelength * itemUnit)
            }
          };
          typeItem=<div {...nodeProps} className="jazz-hiersearch-type">{nodetypename[node[0].Type+1]}</div>
        }

        nodelength=payloadNo-lastpayloadNo;
        lastpayloadNo=payloadNo;
        nodetype.push(typeItem);
      }

    })
    return(
        <div className="jazz-search" >
            <div className="jazz-searchtype">
              {nodetype}
            </div>
            <Menu menuItems={nodemenuItems} autoWidth={false} className="jazz-searchmenu" menuItemClassName="jazz-searchmenuitem" onItemClick={this._onItemClick}/>
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
      </div>

      )
  }
});

module.exports = HierarchySearch;
