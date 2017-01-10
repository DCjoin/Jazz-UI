'use strict';
import React from "react";
import HierarchyButton from '../components/Hierarchy/HierarchyButton.jsx';
import DimButton from '../components/Dim/DimButton.jsx';

let HierAndDimHeader = React.createClass({
  propTypes: {
    onHierachyTreeClick: React.PropTypes.func,
    onDimTreeClick: React.PropTypes.func, //node.Id==0 为‘全部维度’
  },
  //mixins: [Navigation, State],
  _onHierachyTreeClick: function(node) {
    this.props.onHierachyTreeClick(node,2);
    this.refs.dimButton.resetButtonName();
    this.setState({
      dimActive: true,
      hierId: node.Id,
      HierarchyShow: false,
      dimParentNode: node,
      dimId: null,
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
      hierId: null,
      HierarchyShow: false,
      dimActive:false,
      dimId: null,
      DimShow: false,
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
      <div style={{
          color: '#ffffff'
        }}>-</div>
        <DimButton ref={'dimButton'}
          active={this.state.dimActive}
          onTreeClick={this._onDimTreeClick}
          parentNode={this.state.dimParentNode}
          onButtonClick={this._onDimButtonClick}
          show={this.state.DimShow}
          handleClickAway={this.handleDimClickAway}
          dimId={this.state.dimId}/>
      </div>
      )
  },
});
module.exports = HierAndDimHeader;
