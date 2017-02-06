'use strict';
import React from "react";
import _ from 'lodash';
import HierarchyButton from '../components/Hierarchy/HierarchyButton.jsx';
import DimButton from '../components/Dim/DimButton.jsx';
import {nodeType} from 'constants/TreeConstants.jsx';

let HierAndDimHeader = React.createClass({
  propTypes: {
    isBuilding:React.PropTypes.bool,
    onHierachyTreeClick: React.PropTypes.func,
  },
  //mixins: [Navigation, State],
  _onHierachyTreeClick: function(node) {
    var dimNameShow=true;
    if(node.Type!==nodeType.Building && _.isBoolean(this.props.isBuilding)){
      dimNameShow=false
    }
    this.props.onHierachyTreeClick(node,2);
    if(this.refs.dimButton){
      this.refs.dimButton.resetButtonName();
    }

    this.setState({
      dimActive: true,
      hierId: node.Id,
      HierarchyShow: false,
      dimParentNode: node,
      dimId: null,
      dimNameShow:dimNameShow
    });
  },
  _onDimTreeClick: function(node) {
    if (node.Id !== 0) {
      this.props.onHierachyTreeClick(node,6);
    this.setState({
      dimId: node.Id,
      HierarchyShow: true,
      DimShow: false
    });
  } else {
    this.props.onHierachyTreeClick(this.state.dimParentNode,2);
    this.setState({
      dimId: null,
      HierarchyShow: true,
      DimShow: false,
    });
  }
  },
  _onHierarchButtonClick: function() {
    this.setState({
      HierarchyShow: true,
      DimShow: false
    });
  },
  _onDimButtonClick: function() {
  this.setState({
    HierarchyShow: false,
    DimShow: true
  });
  },
  handleHierClickAway: function() {
    this.setState({
      HierarchyShow: false
    });
  },
  handleDimClickAway: function() {
  this.setState({
    DimShow: false
  });
  },
  getInitialState: function() {
    return {
      hierId: this.props.hierarchyId || null,
      dimParentNode:this.props.hierarchyId?{Id:this.props.hierarchyId}:null,
      HierarchyShow: false,
      dimActive:this.props.hierarchyId?true:false,
      dimId: null,
      DimShow: false,
      dimNameShow:_.isBoolean(this.props.isBuilding)?this.props.isBuilding:true
    };
  },
  render: function() {
    return (
      <div className="jazz-dataselectmainpanel header">
        <HierarchyButton hierId={this.state.hierId}
      onTreeClick={this._onHierachyTreeClick}
      onButtonClick={this._onHierarchButtonClick}
      show={this.state.HierarchyShow}
      handleClickAway={this.handleHierClickAway}
      isDimTreeShow={false}/>
    {this.state.dimNameShow?
      <div style={{
          color: '#ffffff'
        }}>-</div>
      :null
    }

      {this.state.dimNameShow?
        <DimButton ref={'dimButton'}
          active={this.state.dimActive}
          onTreeClick={this._onDimTreeClick}
          parentNode={this.state.dimParentNode}
          onButtonClick={this._onDimButtonClick}
          show={this.state.DimShow}
          handleClickAway={this.handleDimClickAway}
          dimId={this.state.dimId}/>:
        null}

      </div>
      )
  },
});
module.exports = HierAndDimHeader;
