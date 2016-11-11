'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import HierarchyButton from '../components/Hierarchy/HierarchyButton.jsx';
import HierarchyStore from '../stores/HierarchyStore.jsx';
import DimButton from '../components/Dim/DimButton.jsx';
import assign from 'object-assign';

let HierHeader = React.createClass({
  propTypes: {
    onHierachyTreeClick: React.PropTypes.func,
    onDimTreeClick: React.PropTypes.func, //node.Id==0 为‘全部维度’
  },
  //mixins: [Navigation, State],
  _onHierachyTreeClick: function(node) {
    var clickNode = assign({}, node);
    if (clickNode.Id < 0) {
      clickNode.Id = -clickNode.Id;
    }
    this.props.onHierachyTreeClick(clickNode);
    this.setState({
      hierId: node.Id,
      HierarchyShow: false,
    });
  },
  _onHierarchButtonClick: function() {
    this.setState({
      HierarchyShow: true,
    });
  },
  handleHierClickAway: function() {
    this.setState({
      HierarchyShow: false
    });
  },
  getInitialState: function() {
    return {
      hierId: null,
      HierarchyShow: false,

    };
  },
  render: function() {
    return (
      <div className="jazz-dataselectmainpanel header">
        <HierarchyButton hierId={this.state.hierId}
      onTreeClick={this._onHierachyTreeClick}
      onButtonClick={this._onHierarchButtonClick}
      show={this.state.HierarchyShow}
      handleClickAway={this.handleHierClickAway}/>
  </div>
      )
  },
});
module.exports = HierHeader;
