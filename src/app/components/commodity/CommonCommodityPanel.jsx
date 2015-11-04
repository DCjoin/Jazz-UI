'use strict';
import React from "react";
import { Navigation, State } from 'react-router';
import CommodityStore from '../../stores/CommodityStore.jsx';
import CommodityAction from '../../actions/CommodityAction.jsx';
import CommonCommodityList from './CommonCommodityList.jsx';
import HierarchyButton from '../Hierarchy/HierarchyButton.jsx';
import DimButton from '../Dim/DimButton.jsx';
import TagAction from '../../actions/TagAction.jsx';

var CommonCommodityPanel = React.createClass({
  mixins: [Navigation, State],
  propTypes: {
    ecType: React.PropTypes.string,
  },
  _onHierachyTreeClick: function(node) {
    if (node != this.state.dimParentNode) {
      CommodityAction.setCurrentHierarchyInfo(node);
      if (this.props.ecType == "Cost") {
        this.refs.dimButton.resetButtonName();
      }

      this.setState({
        dimActive: true,
        dimParentNode: node,
        HierarchyShow: false,
        DimShow: true,
        checkedCommodityList: null,
        dimId: null
      });
    }

  },
  _onHierarchButtonClick: function() {
    this.setState({
      HierarchyShow: true,
      DimShow: false
    });
  },
  handleHierClickAway: function() {
    this.setState({
      HierarchyShow: false
    });
  },
  _onDimTreeClick: function(node) {
    if (node.Id !== 0) {
      CommodityAction.setCurrentDimInfo(node);
    } else {
      CommodityAction.setCurrentDimInfo(null);
    }
    this.setState({
      HierarchyShow: true,
      DimShow: false,
      checkedCommodityList: null,
      dimId: node.Id
    });
  },
  _onDimButtonClick: function() {
    this.setState({
      HierarchyShow: false,
      DimShow: true
    });
  },
  handleDimClickAway: function() {
    this.setState({
      DimShow: false
    });
  },
  getInitialState: function() {
    return {
      HierarchyShow: false,
      dimActive: false,
      dimParentNode: null,
      DimShow: false,
      checkedCommodityList: CommodityStore.getCommodityStatus(),
    };
  },

  componentWillMount: function() {
    let hierNode = CommodityStore.getHierNode();
    let dimNode = CommodityStore.getCurrentDimNode();
    if (!!dimNode) {
      this.setState({
        dimId: dimNode.dimId
      });
    }
    if (!!hierNode) {
      let node = {
        Id: hierNode.hierId,
        Name: hierNode.hierName
      };
      this.setState({
        dimParentNode: node,
        dimActive: true,
      });
    }
  },
  componentWillReceiveProps: function() {
    this.setState({
      checkedCommodityList: CommodityStore.getCommodityStatus()
    });
  },
  componentWillUnmount: function() {
    // TagAction.setCurrentDimentionInfo(null, null);
    // CommodityAction.setCurrentDimInfo(null);
  },
  render: function() {
    let CurrentHierId = CommodityStore.getCurrentHierarchyId(),
      CurrentDimId = !!CommodityStore.getCurrentDimNode() ? CommodityStore.getCurrentDimNode().dimId : null;

    let header, content;
    //header
    if (this.props.ecType == "Carbon") {
      header = (
        <div className="header">
          <HierarchyButton hierId={CurrentHierId}
        onTreeClick={this._onHierachyTreeClick}
        onButtonClick={this._onHierarchButtonClick}
        show={this.state.HierarchyShow}
        handleClickAway={this.handleHierClickAway}/>
        </div>


      )
    } else {
      if (this.props.ecType == "Cost") {
        header = (
          <div className="header">
            <HierarchyButton hierId={CurrentHierId}
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



      }
    }
    //content
    if (CurrentHierId !== null) {
      content = <div style={{
        display: 'flex'
      }}><CommonCommodityList checkedCommodityList={this.state.checkedCommodityList}/></div>
    }
    return (
      <div className="jazz-dataselectmainpanel">
          {header}
          {content}
      </div>
      )
  }
});

module.exports = CommonCommodityPanel;
