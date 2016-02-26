'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import HierarchyButton from '../components/Hierarchy/HierarchyButton.jsx';
import DimButton from '../components/Dim/DimButton.jsx';

let HierAndDimHeader = React.createClass({

  propTypes: {
    onHierachyTreeClick: React.PropTypes.func,
    onDimTreeClick: React.PropTypes.func, //node.Id==0 为‘全部维度’
  },
  mixins: [Navigation, State],
  _onHierachyTreeClick: function(node) {
    this.props.onHierachyTreeClick(node);
    this.refs.dimButton.resetButtonName();
    this.setState({
      dimActive: true,
      dimParentNode: node,
      HierarchyShow: false,
      DimShow: true,
      dimId: null
    });
  },
  _onHierarchButtonClick: function() {
    this.setState({
      HierarchyShow: true,
      DimShow: false
    });
  },
  _onDimTreeClick: function(node) {
    if (node.Id !== 0) {
      this.setState({
        dimId: node.Id,
        HierarchyShow: true,
        DimShow: false
      });
    } else {
      this.setState({
        dimId: null,
        HierarchyShow: true,
        DimShow: false
      });
    }
    this.props.onDimTreeClick(node);

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

      dimActive: false,
      dimId: null,
      dimParentNode: null,
      HierarchyShow: false,
      DimShow: false,
    };
  },
  render: function() {
    var hierId = (this.state.dimParentNode === null) ? null : this.state.dimParentNode.Id;
    return (
      <div className="jazz-dataselectmainpanel header">
        <HierarchyButton hierId={hierId}
      onTreeClick={this._onHierachyTreeClick}
      onButtonClick={this._onHierarchButtonClick}
      show={this.state.HierarchyShow}
      handleClickAway={this.handleHierClickAway}/>

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
