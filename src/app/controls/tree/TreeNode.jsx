'use strict';

import React from 'react';
import {Checkbox} from 'material-ui';
import TreeConstants from '../../constants/TreeConstants.jsx';
import assign from 'object-assign';
import classNames from 'classnames';
import _ from 'lodash';
import Immutable from 'immutable';
import { List, includes } from 'immutable';
import FolderAction from '../../actions/FolderAction.jsx';
import dragula from 'react-dragula';
import { treeSource } from '../../constants/TreeSource.jsx';

//import AlarmStore from '../../stores/AlarmStore.jsx';
//import BubbleIcon from '../../components/BubbleIcon.jsx';
let {nodeType} = TreeConstants;

var TreeNode = React.createClass({
  //mixins: [React.addons.PureRenderMixin],

  propTypes: {
    // feature
    hasCheckBox: React.PropTypes.bool,
    allHasCheckBox: React.PropTypes.bool,
    // there is alarm bubble for every node
    hasBubble: React.PropTypes.bool,

    // node style
    treeNodeClass: React.PropTypes.string,

    // self style
    indent: React.PropTypes.number,
    indentUnit: React.PropTypes.number,
    nodeOriginPaddingLeft: React.PropTypes.number,

    // self attributes
    // enabled to change "HasDataPrivilege" attr when "HasDataPrivilege" is false
    enabledChangeDataPrivilege: React.PropTypes.bool,
    // disabled selectNode method, when disable is true
    allDisabled: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    hasChild: React.PropTypes.bool,
    level: React.PropTypes.number,
    collapsed: React.PropTypes.bool,
    collapsedLevel: React.PropTypes.number,

    // interface
    onSelectNode: React.PropTypes.func,
    generateNodeConent: React.PropTypes.func,

    // dataSource
    nodeData: React.PropTypes.object,
    // selected node when nodeData.Id == a node.Id in selectedNode
    selectedNode: React.PropTypes.object,
    // checked node when nodeData.Id == a node.Id in checkedNodes
    checkedNodes: React.PropTypes.object,

    //for copy opertation
    isFolderOperationTree: React.PropTypes.bool,

    putGragulaContainer: React.PropTypes.func,
    collapsedNodeId: React.PropTypes.number,
    // arrow style
    arrowClass: React.PropTypes.string,
    treeSource: React.PropTypes.number,
  },

  getDefaultProps: function() {
    return {
      // indent
      indent: 0,
      indentUnit: 20,
      nodeOriginPaddingLeft: 18,
      treeNodeClass: "",
      enabledChangeDataPrivilege: false,
      disabled: false,
      // feature
      hasBubble: false,
      hasCheckBox: false,
      // custome method
      generateNodeConent: null,
      treeSource: treeSource.None
    };
  },

  getInitialState: function() {
    return {
      collapsed: this.getDefaultCollapsed(this.props),
      isEdit: false
    };
  },

  getDefaultCollapsedBySelectedNode: function(props) {
    var that = this;
    var f = function(item) {
      if (item.get('Id') == props.selectedNode.get('Id')) {
        return true;
      } else {
        if (!!item.get('Children')) {
          let has = false;
          item.get('Children').forEach(function(child) {
            if (child !== null) {
              if (f(child))
                has = true;
            }

          });
          return has;
        }
        return false;
      }
    };
    if (!!props.selectedNode) {
      if (props.selectedNode.get('Id') == props.nodeData.get('Id')) {
        return false;
      } else {
        return f(props.nodeData);
      }

    } else {
      return false;
    }
  },
  getDefaultCollapsed: function(props) {
    var levelStatus = false,
      checkedStatus = !this.getDefaultCollapsedBySelectedNode(props),
      collapseStatus = !(props.nodeData.get('Id') == props.collapsedNodeId);
    if (props.collapsedLevel === 0 || props.collapsedLevel) {
      levelStatus = props.level > props.collapsedLevel;
    }
    if (checkedStatus) {
      let nodes = props.nodeData.get("Children");
      let that = this;
      if (!!nodes) {
        nodes.forEach(function(node) {
          if (!!props.checkedNodes) {
            props.checkedNodes.forEach(function(checkedNode) {
              if (node.get("Id") == checkedNode.get("Id")) {
                checkedStatus = false;
              }
            });
          }
        });
      }
    }
    return (levelStatus && checkedStatus && collapseStatus);
  },
  componentWillReceiveProps: function(nextProps) {
    if (nextProps.selectedNode != this.props.selectedNode || nextProps.collapsedNodeId != this.props.collapsedNodeId) {
      if (this.state.collapsed) {
        this.setState({
          collapsed: this.getDefaultCollapsed(nextProps),
        });
      }

    }
  },
  handleClickArrow: function(e) {
    e.stopPropagation();
    this.setState({
      collapsed: !this.state.collapsed
    });
    if (this.props.nodeData.get('IsSenderCopy') && !this.props.nodeData.get('IsRead')) {
      FolderAction.modifyFolderReadStatus(this.props.nodeData);
    }
  },

  handleClickNode: function(e) {
    if (!this.props.disabled) {
      this.props.onSelectNode(this.props.nodeData, e);
    }
  },

  // judge this item is whether been selected
  isSelected: function(props = this.props) {
    let {selectedNode, nodeData} = props;
    if (selectedNode && nodeData) {
      return selectedNode.get("Id") == nodeData.get("Id");
    } else {
      return false;
    }
  },

  isChecked: function(props = this.props) {
    var checked = false;
    let {checkedNodes, nodeData} = props;
    if (checkedNodes && checkedNodes.forEach) {
      checkedNodes.forEach(node => {
        if (node.get("Id") == nodeData.get("Id"))
          checked = true;
      });
    }
    return checked;
  },
  isLastChecked: function(props = this.props) {
    var checked = false;
    let {checkedNodes, nodeData} = props, node;

    if (checkedNodes.size > 0) {
      checkedNodes = checkedNodes.toJS();
      node = checkedNodes[checkedNodes.length - 1];
      checked = node.Id == nodeData.get("Id");
    }

    // if (checkedNodes && checkedNodes.forEach) {
    //   checkedNodes.forEach(node => {
    //     if (node.get("Id") == nodeData.get("Id"))
    //       checked = true;
    //   });
    // }
    return checked;
  },
  operateCollapse: function(nodes, callbackName) {
    for (var key in nodes) {
      if (typeof nodes[key][callbackName] == "function") {
        nodes[key][callbackName](nodes[key].refs);
      }
    }
  },

  collapseAll: function(nodes) {
    this.setState({
      collapsed: true
    }, function() {
      this.operateCollapse(nodes, "collapseAll");
    });
  },

  unfoldAll: function(nodes) {
    this.setState({
      collapsed: false
    }, function() {
      this.operateCollapse(nodes, "unfoldAll");
    });
  },

  generateArrow: function(hasChild) {
    var nodeData = this.props.nodeData;
    var type = nodeData.get("Type");
    var {arrowClass} = this.props;
    return (
      <div className={classNames("arrow", arrowClass, true)} onClick={this.handleClickArrow}>
        <div className={classNames({
        "hasChild": (hasChild || type == nodeType.Folder || (nodeData.get('Id') === this.props.collapsedNodeId && nodeData.get('Type') !== 7)),
        "hasNoChild": !(hasChild || type == nodeType.Folder || (nodeData.get('Id') === this.props.collapsedNodeId && nodeData.get('Type') !== 7))
      })}>
          <div className={classNames({
        "fa icon-hierarchy-unfold": !this.state.collapsed,
        "fa icon-hierarchy-fold": this.state.collapsed
      })}/>
        </div>
      </div>
      );
  },

  generateCheckbox: function() {
    var checkboxProps = {
      ref: "pop_tree_node_checkbox_" + this.props.nodeData.get("Id"),
      // onCheck: this.handleClickNode,
      disabled: this.props.disabled,
      defaultSwitched: this.isChecked(this.props),
      checked: this.isChecked(this.props),
    };
    return (
      <div className="pop-tree-node-checkbox">
        <Checkbox {...checkboxProps}></Checkbox>
      </div>
      );
  },

  // this is a default node content, user can custome this part by pass a generateNodeConent method
  generateNodeConent: function(nodeData) {

    // show different icon depend on node type
    var checkboxThemeProps = {};
    var type = nodeData.get("Type");
    var isAsset = nodeData.get("isAsset");
    var {indent, indentUnit} = this.props;
    var icon = (
    <div className="node-content-icon">
          <div className={classNames({
      "icon-customer": type == nodeType.Customer,
      "icon-orgnization": type == nodeType.Organization,
      "icon-site": type == nodeType.Site,
      "icon-building": type == nodeType.Building,
      "icon-room": type == nodeType.Room,
      "icon-panel": type == nodeType.Panel && isAsset,
      "icon-panel-box": type == nodeType.Panel && !isAsset,
      "icon-device": type == nodeType.Device && isAsset,
      "icon-device-box": type == nodeType.Device && !isAsset,
      "icon-column-fold": type == nodeType.Folder,
      "icon-image": type == nodeType.Widget,
      "icon-dimension-node": type == nodeType.Area
    })}/>
        </div>
    );

    var text = (
    <div className="node-content-text">{nodeData.get("Name")}</div>
    );

    /*
        var redBubble = null;

        var count = AlarmStore.getAlarmCountByHierarchyId(nodeData.get("Id"));

        if (count && this.props.hasBubble) {
          redBubble = <BubbleIcon style={{marginLeft:'4px',flex:'none'}} number={count} />;
        }
    */
    return (
      <div className={classNames({
        "tree-node-content": true,
        "tree-node-content-no-privilege": this.props.disabled
      })} {...checkboxThemeProps} style={{maxWidth:300-Number(indent * indentUnit) - this.props.nodeOriginPaddingLeft}}>
        {icon}
        {text}

      </div>
      );
  },

  generateNode: function() {
    var that = this;
    var {nodeData, treeNodeClass, indent, indentUnit, theme} = this.props;
    var treeNodeProps = {
      ref: 'treenode',
      key: nodeData.get('Id'),
      id: nodeData.get('Id'),
      className: classNames(_.set({
        "tree-node": true,
        "selected": this.props.hasCheckBox ? this.isLastChecked(this.props) : this.isSelected(this.props) // this.state.selected
      }), treeNodeClass, true),
      style: {
        paddingLeft: Number(indent * indentUnit) + this.props.nodeOriginPaddingLeft
      },
      title: nodeData.get("Name"),
      onClick: this.handleClickNode
    };

    return (
      <div {...treeNodeProps}>
       {this.generateArrow(nodeData.get("Children") && nodeData.get("Children").size > 0)}
        {this.props.hasCheckBox ? this.generateCheckbox() : null}
       <div className="content" style={{ whiteSpace: 'nowrap',
           textOverflow: 'ellipsis',
           overflow: 'hidden'}}>
        {this.props.generateNodeConent ? this.props.generateNodeConent(this.props.nodeData) : this.generateNodeConent(this.props.nodeData)}
       </div>
      </div>


      );
  },

  generateChildren: function() {
    var nodeData = this.props.nodeData,
      children = null;
    if (nodeData.get("Children")) {
      children = nodeData.get("Children").map(childNodeData => {
        var nodeProps = assign({}, this.props, {
          key: childNodeData.get("Id"),
          //ref: childNodeData.get("Id"),
          ref: 'treechildren',
          theme: this.props.theme,
          nodeOriginPaddingLeft: this.props.nodeOriginPaddingLeft,
          indentUnit: this.props.indentUnit,
          indent: this.props.indent + 1,
          level: this.props.level + 1,
          nodeData: childNodeData,

          hasBubble: this.props.hasBubble,
          hasCheckBox: this.props.allHasCheckBox || childNodeData.get("hasCheckBox"),
          //  disabled: !this.props.enabledChangeDataPrivilege && ( this.props.allDisabled || (childNodeData.get("HasDataPrivilege") !== null && !childNodeData.get("HasDataPrivilege")) ),
          disabled: this.props.allDisabled,
          selectedNode: this.props.selectedNode,
          checkedNodes: this.props.checkedNodes,
          onSelectNode: this.props.onSelectNode,
        });
        return (
          <TreeNode {...nodeProps}/>
          );
      });
    }
    return (
      <div key='treechildren' ref='treechildren' className={classNames({
        "tree-children": true,
        "collapse": this.state.collapsed
      })}>
        {children}
      </div>
      );
  },
  componentDidMount: function() {
    //for Gragula
    if (this.props.nodeData.get('Id') != -1 && this.props.nodeData.get('Type') != -1) {
      this.props.putGragulaContainer(React.findDOMNode(this));
    }

  },

  render: function() {
    var generateNode = ((this.props.treeSource === treeSource.FolderOperation && this.props.nodeData.get("Type") == nodeType.Widget) ? null : this.generateNode());
    return (

      <div key={this.props.nodeData.get('Id')} id={this.props.nodeData.get('Id')} className="pop-tree-node-container">
        {generateNode}
        {this.generateChildren()}
      </div>

      );
  }

});


module.exports = TreeNode;
