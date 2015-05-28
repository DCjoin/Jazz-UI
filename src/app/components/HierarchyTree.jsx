'use strict';
import React from "react";
import classNames from 'classnames';
import {Paper} from 'material-ui';
import { Link,Navigation,State,RouteHandler } from 'react-router';
import assign from 'object-assign';



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
      collapsed: false,
      selected: false,
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
          "fa fa-users": nodeData.Type == -1,
          "fa fa-hospital-o": nodeData.Type == 0,
          "fa fa-building-o": nodeData.Type == 1,
          "fa fa-building": nodeData.Type == 2,
          "fa fa-shirtsinbulk": nodeData.Type == 3,
          "fa fa-server": nodeData.Type == 4,
          "fa fa-tablet": nodeData.Type == 5
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
var testNode={
     "Id":1,
     "Code":"SOHO",
     "Name":"SE中国有限公司",
     "Type":-1,
     "Children":[
     {
       "Id":2,
       "Code":"BJSOHO",
       "Name":"SE中国北区",
       "Type":0,
       "Children":[
       {
         "Id":3,
         "Code":"BJSOHO",
         "Name":"SE北京",
         "Type":1
       },
       {
         "Id":4,
         "Code":"BJSOHO",
         "Name":"SE石家庄",
         "Type":1
       }
       ]
     },
     {
       "Id":5,
       "Code":"WJSOHO",
       "Name":"SE中国南区",
       "Type":0,
       "Children":[
       {
         "Id":6,
         "Code":"BJSOHO",
         "Name":"SE上海",
         "Type":1
       },
       {
         "Id":7,
         "Code":"BJSOHO",
         "Name":"SE浙江",
         "Type":1
       }
       ]
     }
     ]
     };
let HierarchyTree=React.createClass({
  _onTreeClick(node){

  },

  render:function(){

    return(

        <Paper className='jazz-hierarchybutton-paper'>

            <label style={{display:'inline-block',width:'200px',height:'25px',border:'3px solid gray','border-radius':'20px','margin-top':'10px'}}>
              <img style={{float:'left'}} src={require('../less/images/search-input-search.png')}/>
              <input style={{width:'130px',height:'20px','background-color':'transparent',border:'transparent'}} placeholder="XX"/>
            </label>

            <TreeView allNode={testNode}
                      selectedNode={testNode}
                      onTreeClick={this._onTreeClick} />
        </Paper>

    )
  }
});

module.exports=HierarchyTree;
