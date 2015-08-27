'use strict';

import React from 'react';
import mui from 'material-ui';
import {Mixins} from 'material-ui';
import assign from 'object-assign';
import classNames from 'classnames';
import _ from 'lodash';
import Immutable from 'immutable';
import TreeNode from './TreeNode.jsx';

import dragula from 'react-dragula';
var lastOver=null,
    lastContainer=null,
    timeoutHandel=null,
    pass=true;


var drake=dragula({
  moves: function (el, source, handle) {
    el.style.backgroundColor='#f2f2f2';
    return true; // elements are always draggable by default
  },
  direction: 'vertical',         // Y axis is considered when determining where an element would be dropped
  copy: false,                   // elements are moved by default, not copied
  revertOnSpill: false,          // spilling will put the element back where it was dragged from, if this is true
  removeOnSpill: false,          // spilling will `.remove` the element, if this is true
});

var Tree = React.createClass({
  mixins: [React.addons.PureRenderMixin,Mixins.ClickAwayable],
  // compatibleJSON data transfer json to a immutableJS
  compatibleJSON: function (data) {
    if(data && data.toJSON) {
      return data;
    } else {
      return Immutable.fromJS(data);
    }
  },

  propTypes: {
    // feature
    // there is a checkbox, when value is true
    allHasCheckBox: React.PropTypes.bool,
    // there is alarm bubble for every node
    hasBubble: React.PropTypes.bool,

    // root node origin left padding
    nodeOriginPaddingLeft: React.PropTypes.number,
    // tree container style
    treeClass: React.PropTypes.string,
    // node style
    treeNodeClass: React.PropTypes.string,

    // enabled to change "HasDataPrivilege" attr when "HasDataPrivilege" is false
    enabledChangeDataPrivilege: React.PropTypes.bool,
    // disabled selectNode method, when disable is true
    allDisabled: React.PropTypes.bool,
    // collapsed level, begin with "0"
    collapsedLevel: React.PropTypes.number,

    // necessary properties
    // must have "Id" parameter for every nodeData
    selectedNode: React.PropTypes.object,
    // must have "Id" parameter for every nodeData
    checkedNodes: React.PropTypes.array,
    // must have "Id" parameter for every nodeData
    allNode: React.PropTypes.object.isRequired,

    // interface
    onSelectNode: React.PropTypes.func.isRequired,
    generateNodeConent: React.PropTypes.func,
    //for copy operation
    isFolderOperationTree:React.PropTypes.bool,
    onGragulaNode:React.PropTypes.func,
    // arrow style
    arrowClass: React.PropTypes.string,

  },
  getInitialState:function(){
    return{
      collapsedNodeId:null
    };
  },
  getDefaultProps: function () {
    return {
      indent: 0,
      indentUnit: 20,
      nodeOriginPaddingLeft: 18,

      treeClass: "",
      treeNodeClass: "",
      enabledChangeDataPrivilege: false,
      disabled: false,
      onSelectNode: function () {},
      generateNodeConent: null
    };
  },
  onSelectNode: function (node, event) {
    if(!this.props.disable){
      this.props.onSelectNode(node, event);
    }
  },

  collapseAll: function () {
    var nodes = this.refs;
    for (var key in nodes) {
      nodes[key].collapseAll(nodes[key].refs);
    }
  },

  unfoldAll: function () {
    var nodes = this.refs;
    for (var key in nodes) {
      nodes[key].unfoldAll(nodes[key].refs);
    }
  },

  putGragulaContainer:function(container){
    drake.containers.push(container);
  },

  _onDrop:function(el, target, source){
    this.props.onGragulaNode(target.id,source.id,pass);
    clearTimeout(timeoutHandel);
    pass=true;
  },

  _onShadow:function(el, container){
    // console.log("_onShadow");
    // console.log(el);
    // console.log(container);
    if(container.children[0].id==el.id){
      lastOver=container.children[1];
    }
    else {
      lastOver=container.children[0];
    }
    if(lastContainer!=container){
      pass=false;
    }
    else {
      pass=!pass;
    }
  //  console.log("_onShadow_pass"+pass);

    if(pass){
      el.style.backgroundColor='#f2f2f2';
      lastOver.style.backgroundColor='transparent';
      clearTimeout(timeoutHandel);
    }
    else {
      lastOver.style.backgroundColor='#f2f2f2';
    }
    //  console.log(lastOver);
    timeoutHandel=setTimeout(()=>{
    //  console.log("_onShadow_setTimeout");
      pass=true;
    this.setState({
      collapsedNodeId:parseInt(lastOver.id)
    });
  },2000000);
  lastContainer=container;
  },

  componentDidMount:function(){
    lastOver=null;
    pass=false;
    drake.on('drop',this._onDrop);
    drake.on('shadow',this._onShadow);

  },
  render: function () {
    var dataSource = this.compatibleJSON(this.props.allNode);
    var tree = [];
    var drawTree = (dataSource, parentNode, parentIndent) => {
      if (dataSource !== null) {
        var props = {
          ref: dataSource.get("Id"),
          treeNodeClass: this.props.treeNodeClass,
          nodeOriginPaddingLeft: this.props.nodeOriginPaddingLeft,
          indentUnit: this.props.indentUnit,
          indent: parentIndent || 0,
          level: parentIndent || 0,
          nodeData: dataSource,

          enabledChangeDataPrivilege: this.props.enabledChangeDataPrivilege,
          allDisabled: this.props.allDisabled,
          disabled: this.props.allDisabled,
          allHasCheckBox: this.props.allHasCheckBox,
          hasCheckBox: this.props.allHasCheckBox && dataSource.get("hasCheckBox"),
          hasBubble: this.props.hasBubble,
          collapsedLevel: this.props.collapsedLevel,

          selectedNode: this.compatibleJSON(this.props.selectedNode),
          checkedNodes: this.compatibleJSON(this.props.checkedNodes),
          onSelectNode: this.onSelectNode,
          generateNodeConent: this.props.generateNodeConent,
          isFolderOperationTree:this.props.isFolderOperationTree,

          putGragulaContainer:this.putGragulaContainer,
          collapsedNodeId:this.state.collapsedNodeId,
          arrowClass:this.props.arrowClass
        };
        parentNode.push(<TreeNode {...props}></TreeNode>);
      }
    };

    // began to draw tree
    if (Immutable.List.isList(dataSource)) {
      dataSource.forEach(function (node) {
        drawTree(node, tree, 0);
      });
    } else {
      drawTree(dataSource, tree, 0);
    }



    return (
      <div className={classNames(_.set({
        "pop-tree-view": true
      }, this.props.treeClass, true))}>
        {tree}
      </div>
    );
  }

});

module.exports = Tree;
