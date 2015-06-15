'use strict';
import React from "react";
import classNames from 'classnames';
import {Paper} from 'material-ui';
import { Link,Navigation,State,RouteHandler } from 'react-router';
import assign from 'object-assign';

import {nodeType} from '../constants/TreeConstants.jsx';
import Search from './DimSearch.jsx'


var TreeNode = React.createClass({

  mixins:[Navigation,State],

  propTypes: {
    selected: React.PropTypes.bool,
    collapsed: React.PropTypes.bool,
    hasChild: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      indent: 0,
      indentUnit: 15,
    };
  },

  getInitialState: function() {
    return {
      collapsed: true,
      selected: false,
    };
  },
  componentWillMount:function(){
    if(this.props.indent==0){
      this.setState({
        collapsed: false,
      });
      return;
    };

    if(this.props.selectedNode.HierarchyId==this.props.id){
      this.setState({
        collapsed: false,
      });
      return;
    }

  },
  handleClickArrow: function(e){
    e.stopPropagation();
    this.setState({
      collapsed: !this.state.collapsed
    });
  },

  handleClickNode: function(){
    //var node = assign({}, this.props);
    //HierarchyActionCreator.selectNode(node);
    this.props.onSelectedNode(this.props.nodeData);
  },

  operateCollapse: function (nodes, callbackName) {

    for(var key in nodes){
      if(typeof nodes[key][callbackName] == "function"){
        nodes[key][callbackName](nodes[key].refs);
      }
    }
  },

  collapseAll: function (nodes) {

    this.setState({
      collapsed: true
    }, function () {
      this.operateCollapse(nodes, "collapseAll");
    });
  },

  unfoldAll: function (nodes) {

    this.setState({
      collapsed: false
    }, function() {
      this.operateCollapse(nodes, "unfoldAll");
    });
  },

  generateArrow: function (hasChild) {
    return (
      <div className="arrow" onClick={this.handleClickArrow}>
        <div className={classNames({
          "hasChild": hasChild,
          "hasNoChild": !hasChild
          })}>
          <div className={classNames({
            "fa fa-minus-circle": !this.state.collapsed,
            "fa fa-plus-circle": this.state.collapsed,
          })} />
        </div>
      </div>
    );
  },



  generateNodeConent: function (nodeData) {

    // show different icon depend on node type
    var icon = (
      <div className="node-content-icon">
        <div className={classNames({
          "fa fa-users": nodeData.Type == nodeType.Customer,
          "fa fa-hospital-o": nodeData.Type == nodeType.Organization,
          "fa fa-building-o": nodeData.Type == nodeType.Site,
          "fa fa-building": nodeData.Type == nodeType.Building,
          "fa fa-shirtsinbulk": nodeData.Type == nodeType.Room,
          "fa fa-server": nodeData.Type == nodeType.Panel,
          "fa fa-tablet": nodeData.Type == nodeType.Device
        })}></div>
      </div>
    );

    var text = (
      <div className="node-content-text">{nodeData.Name}</div>
    );

    return (
      <div className="tree-node-content">
        {icon}
        {text}
      </div>
    );
  },

  generateNode: function (nodeData) {
    var indentStyle = {
      "padding-left": Number(this.props.indent * this.props.indentUnit)
    };

    return (
      <div className={classNames({
          "tree-node": true,
          "selected": (this.props.selectedNode && this.props.selectedNode.Id == nodeData.Id)
        })} onClick={this.handleClickNode} style={indentStyle}>
        {this.generateArrow(nodeData.Children && nodeData.Children.length > 0)}
        <div className="content">
          {this.generateNodeConent(nodeData)}
        </div>

      </div>
    );
  },

  generateChildren: function (nodeData) {
    var children = null;
    if(Array.isArray(nodeData.Children)){
      children = nodeData.Children.map(childNodeData => {
        var nodeProps = assign({}, this.props, {
          nodeData: childNodeData,
          selectedNode: this.props.selectedNode,
          onSelectedNode: this.props.onSelectedNode,
          indent: this.props.indent + 1,
          id:childNodeData.Id,
          ref: childNodeData.Id
        });
        return (
          <TreeNode {...nodeProps}/>
        );
      });
    }
    return (
      <div className={classNames({
          "tree-children": true,
          "collapse": this.state.collapsed
        })}>
        {children}
      </div>
    );
  },

  render: function() {

    return (
      <div className="pop-tree-node-container">
        {this.generateNode(this.props.nodeData)}
        {this.generateChildren(this.props.nodeData)}
      </div>
    );
  }

});

var TreeView = React.createClass({
    mixins:[Navigation,State],
    propTypes: {
        allNode: React.PropTypes.object.isRequired,
        onTreeClick:React.PropTypes.func.isRequired,
        selectedNode:React.PropTypes.object
    },
    _onSelectNode(node){
        this.setState({selectedNode:node});
        this.props.onTreeClick(node);
    },

    collapseAll: function () {

      var nodes = this.refs;

      for(var key in nodes){
        nodes[key].collapseAll(nodes[key].refs);
      }
    },

    unfoldAll: function () {

      var nodes = this.refs;
      for(var key in nodes){
        nodes[key].unfoldAll(nodes[key].refs);
      }
    },

    getInitialState: function() {
      return {
        selectedNode: this.props.selectedNode,
      };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({selectedNode:nextProps.selectedNode});
    },

    render: function() {
        var dataSource = this.props.allNode;
        var tree = [];
        // var code =  '';
        // if(this.state.selectedNode){
        //     code = this.state.selectedNode.Code;
        // }
        // if(!code && this.props.selectedNode){
        //     code = this.props.selectedNode.Code;
        // }
        // if(this.props.status == formStatus.ADD) code = '';
        var drawTree = (dataSource, parentNode, parentIndent) => {
          if(dataSource !== null){


            // node properties, map response data to props
            var props = {
              indent: parentIndent || 0,
              nodeData: dataSource,
              selectedNode: this.state.selectedNode || this.props.selectedNode,
              onSelectedNode: this._onSelectNode,
              ref: dataSource.Id
            };
            parentNode.push(
              <TreeNode {...props}></TreeNode>
            );
          }
        };

        // began to draw tree
        if(Array.isArray(dataSource)){

          dataSource.forEach(function(node){
            drawTree(node, tree, 0);
          });
        } else {
          drawTree(dataSource, tree, 0);
        }

        return (
          <div className="pop-tree-view">
            {tree}
          </div>
        );
    }

});

let DimTree=React.createClass({
  mixins:[Navigation,State],
  propTypes: {
      allNode: React.PropTypes.object.isRequired,
      onTreeClick:React.PropTypes.func.isRequired,
      selectedNode:React.PropTypes.object
  },
  getInitialState: function() {
      return {
        initialTree:true,
        searchList:false,
        searchTree:false,
        searchValue:null,
        selectedNode:null
      };
    },

   _onSearchChange:function(text){

     var value= document.getElementById("searchfield").value;

     if(value){
       this.setState({
         initialTree:false,
         searchList:true,
         searchTree:false,
         searchValue:value
       })
     }
     else{
       this.setState({
       initialTree:true,
       searchList:false,
       searchTree:false
     })
     }
   },
  render:function(){

    var tree;
    var searchfield;
    var searchtree;
    if(this.state.initialTree) {
                    tree=<TreeView  allNode={this.props.allNode}
                                    selectedNode={this.props.selectedNode}
                                    onTreeClick={this.props.onTreeClick} />
                              };
    if(this.state.searchList){
      searchfield=<Search
                    allNode={this.props.allNode}
                    searchValue={this.state.searchValue}
                    onSearchNodeClick={this.props.onTreeClick}/>

    };
    if(this.state.searchTree) {
      searchtree=<TreeView  allNode={this.props.allNode}
                            selectedNode={this.state.selectedNode}
                            onTreeClick={this.props.onTreeClick} />
                              };

    var paperStyle = {

            backgroundColor: 'white',
            zIndex: '100',
            width:'350px',
            height:'500px',
            position:'absolute',
            left:'-165px'

                                         };

    return(

        <Paper style={paperStyle}>

            <label style={{display:'inline-block',width:'200px',height:'25px',border:'3px solid gray','border-radius':'20px','margin-top':'10px'}}>
              <img style={{float:'left'}} src={require('../less/images/search-input-search.png')}/>
              <input style={{width:'130px',height:'20px','background-color':'transparent',border:'transparent'}} type="text" id="searchfield" onChange={this._onSearchChange}/>
            </label>
            <div style={{'overflow':'auto',height:'460px'}}>
              {tree}
              {searchfield}
              {searchtree}
            </div>

        </Paper>

    )
  }
});

module.exports=DimTree;
