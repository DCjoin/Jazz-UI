'use strict';
import React from "react";
import classNames from 'classnames';
import {Paper,Menu} from 'material-ui';

let treeMap=new Array();

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
      <div className="icon-hierarchy"></div>
    );

    return(
      <div className="jazz-searchmenuitem" onClick={this._onClick}>
      <div style={{'font-size':'16px'}}>
      {icon}
    </div>
    <div className='jazz-dimsearch-nodename' title={this.props.nodeData.Name}>
    {this.props.nodeData.Name}</div>
      </div>
    )
  }
});
let DimSearch = React.createClass({
  propTypes: {
      allNode: React.PropTypes.object.isRequired,
      onSearchNodeClick:React.PropTypes.func.isRequired,
      searchValue: React.PropTypes.string,

  },
  drawNodeType:function(){
    let that=this;
    let nodemenuItems=[];
    var searchvalue=this.props.searchValue;
    nodemenuItems.length=0;
    treeMap.forEach(function(nodeData,i){

        var name=(nodeData.Name).toLocaleUpperCase();
        if(name.indexOf(searchvalue.toLocaleUpperCase())>=0){


          nodemenuItems.push(
            <SearchItem nodeData={nodeData} onClick={that.props.onSearchNodeClick}/>
          );

        }

      });


    return(
        <div className="jazz-search" style={{'margin-left':'16px'}}>
          {nodemenuItems}
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
