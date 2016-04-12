'use strict';

import React from "react";
import { formStatus } from '../../constants/FormStatus.jsx';
import classNames from 'classnames';
import Tree from '../../controls/tree/Tree.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';
import DropdownButton from '../../controls/DropdownButton.jsx';
let MenuItem = require('material-ui/lib/menus/menu-item');

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
        onItemClick: this._onNewWidget,
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
      addBtn = <span onClick={this.props.onAddBtnClick} disabled={this.props.isAddStatus} className={classNames(addBtnClasses)}>
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
