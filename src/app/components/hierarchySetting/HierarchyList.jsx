'use strict';

import React from "react";
import { formStatus } from '../../constants/FormStatus.jsx';
import TreeConstants from '../../constants/TreeConstants.jsx';
import classNames from 'classnames';
import Tree from '../../controls/tree/Tree.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import DropdownButton from '../../controls/DropdownButton.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');
let {nodeType} = TreeConstants;

var HierarchyList = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    onHierarchyClick: React.PropTypes.func,
    onAddBtnClick: React.PropTypes.func,
    hierarchys: React.PropTypes.object,
    selectedNode: React.PropTypes.object
  //onGragulaNode: React.PropTypes.func
  },
  getAddMenuItems: function() {
    var items = HierarchyStore.getDropDownMenuItemsByType(this.props.selectedNode.get('Type')),
      menuItems = [];
    var itemStyle = {
      fontSize: '14px',
      color: '#767a7a',
      paddingLeft: '44px'
    };
    if (items !== null) {
      items.forEach((item, index) => {
        menuItems.push(
          <MenuItem key={index} innerDivStyle={itemStyle} primaryText={item}/>
        )
      })
    }
    return menuItems

  },
  getAddBtnDisabled: function() {
    if (this.props.formStatus === formStatus.ADD) {
      return true;
    } else {
      return HierarchyStore.getAddBtnStatusByNode(this.props.selectedNode);
    }
  },
  _onAddBtnClick: function() {
    let newNodeType = null;
    switch (selectedNode.get('Type')) {
      case nodeType.Site:
        newNodeType = nodeType.Building;
        break;
      case nodeType.Building:
        newNodeType = nodeType.Area;
        break;
      case nodeType.Area:
        newNodeType = nodeType.Area;
        break;
    }
    this.props.onAddBtnClick(newNodeType);
  },
  _onMenuAddBtnClick: function(e, item) {
    let key = parseInt(item.key);
    let newNodeType = null;
    switch (key) {
      case 0:
        newNodeType = nodeType.Organization;
        break;
      case 1:
        newNodeType = nodeType.Site;
        break;
      case 2:
        newNodeType = nodeType.Building;
        break;
    }
    this.props.onAddBtnClick(newNodeType);
  },
  _onImportBtnClick: function() {},
  _onExportBtnClick: function() {},
  render: function() {
    var treeProps = {
        collapsedLevel: 0,
        allNode: this.props.hierarchys,
        allHasCheckBox: false,
        allDisabled: false,
        onSelectNode: this.props.onHierarchyClick,
        selectedNode: this.props.selectedNode,
        arrowClass: 'jazz-foldertree-arrow',
        treeNodeClass: 'jazz-foldertree-node',
      //onGragulaNode: this._onGragulaNode,
      },
      addBtnProps = {
        type: "Add",
        text: I18N.Common.Glossary.Node,
        menuItems: this.getAddMenuItems(),
        onItemClick: this._onMenuAddBtnClick,
      //disabled: this.state.buttonDisabled
      };
    var addBtnClasses = {
        'jazz-tag-leftpanel-header-item': !this.props.isAddStatus,
        'jazz-tag-disabled': this.props.isAddStatus
      },
      fileInputStyle = {
        opacity: 0,
        position: "absolute",
        top: 0,
        left: 0,
        display: 'none'
      };
    var addBtn = null;
    if (this.props.selectedNode.get('Type') > 1) {
      addBtn = <span onClick={this._onAddBtnClick} disabled={this.getAddBtnDisabled()} className={classNames(addBtnClasses)}>
            <span className="icon-add jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Glossary.Node}
          </span>
    } else {
      addBtn = <DropdownButton {...addBtnProps}/>
    }
    return (
      <div className='jazz-tag-leftpanel'>
        <div className="jazz-tag-leftpanel-header">
          {addBtn}
          <label ref="fileInputLabel" className="jazz-tag-leftpanel-header-item" htmlFor="fileInput">
            <span className="icon-import jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Import}
            <input type="file" ref="fileInput" id='fileInput' name='fileInput' onChange={this._onImportBtnClick} style={fileInputStyle}/>
          </label>
          <span onClick={this._onExportBtnClick} className="jazz-tag-leftpanel-header-item">
            <span className="icon-export jazz-tag-leftpanel-header-item-icon"></span>
            {I18N.Common.Button.Export}
          </span>
        </div>
        <div className="jazz-folder-leftpanel-foldertree" style={{
        color: '#ffffff'
      }}>
          <Tree {...treeProps}/>
        </div>
      </div>

      )
  }
});
module.exports = HierarchyList;
