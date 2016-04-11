'use strict';

import React from "react";
import { formStatus } from '../../constants/FormStatus.jsx';
import Tree from '../../controls/tree/Tree.jsx';
import HierarchyStore from '../../stores/hierarchySetting/HierarchyStore.jsx';

var HierarchyList = React.createClass({
  propTypes: {
    formStatus: React.PropTypes.string,
    onHierarchyClick: React.PropTypes.func,
    onAddBtnClick: React.PropTypes.func,
    hierarchys: React.PropTypes.object,
    selectedId: React.PropTypes.number
  //onGragulaNode: React.PropTypes.func
  },
  render: function() {
    var treeProps = {
      collapsedLevel: 0,
      allNode: this.props.hierarchys,
      allHasCheckBox: false,
      allDisabled: false,
      onSelectNode: this.props.onHierarchyClick,
      selectedNode: HierarchyStore.getHierarchyById(this.props.selectedId),
    //onGragulaNode: this._onGragulaNode,
    }
    return (
      <div className="jazz-folder-leftpanel-foldertree">
        <Tree {...treeProps}/>
      </div>
      )
  }
});
module.exports = HierarchyList;
