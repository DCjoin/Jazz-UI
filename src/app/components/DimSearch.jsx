'use strict';
import React from "react";
import classNames from 'classnames';
import {Paper,Menu} from 'material-ui';

let treeMap=new Array();

let DimSearch = React.createClass({
  propTypes: {
      allNode: React.PropTypes.object.isRequired,
      onSearchNodeClick:React.PropTypes.func.isRequired,
      searchValue: React.PropTypes.string,

  },
  _onItemClick:function(e, index, menuItem){

    this.props.onSearchNodeClick(menuItem.node);
  },
  drawNodeType:function(){
    let nodemenuItems=[];
    var searchvalue=this.props.searchValue;
    var payloadNo=0;

    nodemenuItems.length=0;
    treeMap.forEach(function(nodeData,i){
        let menuItem;
        var name=(nodeData.Name).toLocaleUpperCase();
        if(name.indexOf(searchvalue.toLocaleUpperCase())>=0){
          payloadNo++;

          menuItem={payload:payloadNo,iconClassName:"fa fa-users",text:nodeData.Name,node:nodeData};
          nodemenuItems.push(menuItem);

        }

      });


    return(
        <div className="jazz-search" >
            <Menu menuItems={nodemenuItems} autoWidth={false} onItemClick={this._onItemClick}/>
          </div>
    );
  },

  render : function() {
    var dataSource = this.props.allNode;
        treeMap.length=0;
    var  traverse=function(data){
      if(Array.isArray(data)){
        data.forEach(function(node){
          treeMap.push(node);
          if(Array.isArray(node.Children)){
            traverse(node.Children);
          }
        });
      } else if(data) {
        treeMap.push(data);
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

module.exports = DimSearch;
