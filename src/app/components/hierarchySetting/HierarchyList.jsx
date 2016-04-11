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
    selectedNode: React.PropTypes.object
  //onGragulaNode: React.PropTypes.func
  },
  render: function() {
    var treeProps = {
      collapsedLevel: 0,
      allNode: this.props.hierarchys,
      allHasCheckBox: false,
      allDisabled: false,
      onSelectNode: this.props.onHierarchyClick,
      selectedNode: this.props.electedNode,
      arrowClass: 'jazz-foldertree-arrow',
      treeNodeClass: 'jazz-foldertree-node',
    //onGragulaNode: this._onGragulaNode,
    }
    return (
      <div className='jazz-tag-leftpanel'>
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
