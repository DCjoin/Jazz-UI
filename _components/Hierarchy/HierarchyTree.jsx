'use strict';
import React from "react";
import classNames from 'classnames';
import {Paper,FontIcon,TextField} from 'material-ui';
import { Link,Navigation,State,RouteHandler } from 'react-router';
import assign from 'object-assign';
import HierarchyStore from "../../stores/HierarchyStore.jsx";
import {nodeType} from '../../constants/TreeConstants.jsx';
import Search from './HierarchySearch.jsx';


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
      indentUnit: 25,
    };
  },

  getInitialState: function() {
    return {
      collapsed: true,
      selected: false,
    };
  },
  componentWillMount:function(){
    if(this.props.indent===0){
      this.setState({
        collapsed: false,
      });
      return;
    }

    if(this.props.selectedNode.ParentId==this.props.id){
      this.setState({
        collapsed: false,
      });
      return;
    }
    var that=this;
    if(this.props.nodeData.Children){
      this.props.nodeData.Children.forEach(function(nodeData,i){
        if(nodeData.Id==that.props.selectedNode.ParentId){
          that.setState({
            collapsed: false,
          })
        }
      })
    };

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
        })} >
          <div className={classNames({
            "icon-hierarchy-unfold": !this.state.collapsed,
            "icon-hierarchy-fold": this.state.collapsed,
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
          "icon-customer": nodeData.Type == nodeType.Customer,
          "icon-orgnization": nodeData.Type == nodeType.Organization,
          "icon-site": nodeData.Type == nodeType.Site,
          "icon-building": nodeData.Type == nodeType.Building,
          "icon-room": nodeData.Type == nodeType.Room,
          "icon-panel": nodeData.Type == nodeType.Panel,
          "icon-device": nodeData.Type == nodeType.Device
        })}></div>
      </div>
    );

    var text = (
      <div className="node-content-text" title={nodeData.Name}>{nodeData.Name}</div>
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
              id: dataSource.Id,
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

let HierarchyTree=React.createClass({
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

   _onSearchChange:function(e){

     var value= e.target.value;

     if(value){
      React.findDOMNode(this.refs.cleanIcon).style.display='block';
       this.setState({
         initialTree:false,
         searchList:true,
         searchTree:false,
         searchValue:value
       });
     }
     else{
       React.findDOMNode(this.refs.cleanIcon).style.display='none';
       this.setState({
       initialTree:true,
       searchList:false,
       searchTree:false
     });
     }
   },
   _onSearchClick:function(){
     React.findDOMNode(this.refs.searchIcon).style.display='none';
   },
   _onSearchBlur:function(e){
     if(!e.target.value){
         React.findDOMNode(this.refs.searchIcon).style.display='block';
     }
   },
   _onCleanButtonClick:function(){
     React.findDOMNode(this.refs.cleanIcon).style.display='none';
     this.refs.searchText.setValue("");
     this.setState({
       initialTree:true,
       searchList:false,
       searchTree:false
     });
   },
  render:function(){

    var tree;
    var searchfield;
    var searchtree;
    if(this.state.initialTree) {
                    tree = <TreeView  allNode={this.props.allNode}
                                    selectedNode={this.props.selectedNode}
                                    onTreeClick={this.props.onTreeClick} />;
                              }
    if(this.state.searchList){
      searchfield=<Search
                    allNode={this.props.allNode}
                    searchValue={this.state.searchValue}
                    onSearchNodeClick={this.props.onTreeClick}/>;

    }
    if(this.state.searchTree) {
      searchtree=<TreeView  allNode={this.props.allNode}
                            selectedNode={this.state.selectedNode}
                            onTreeClick={this.props.onTreeClick} />;
                              }

    var paperStyle = {
                  backgroundColor: '#ffffff',
                  zIndex: '100',
                  width:'300px',
                  height:'390px',
                  position:'absolute',
                  border:'1px solid #c9c8c8',
                  margin:'12px 10px'
                },
                searchIconStyle={
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

        <Paper style={paperStyle}>

            <label className="tree_search">
              <FontIcon className="icon-search" style={searchIconStyle} ref="searchIcon"/>
              <TextField style={textFieldStyle} className="input" ref="searchText" onClick={this._onSearchClick} onChange={this._onSearchChange}/>
              <FontIcon className="icon-clean" style={cleanIconStyle} hoverColor='#6b6b6b' color="#939796" ref="cleanIcon" onClick={this._onCleanButtonClick}/>
            </label>
            <div className="tree-field">
              {tree}
              {searchfield}
              {searchtree}
            </div>
        </Paper>
    );
  }
});

module.exports=HierarchyTree;
